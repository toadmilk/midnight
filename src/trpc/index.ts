import { privateProcedure, publicProcedure, router } from './trpc';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { z } from 'zod';
import { utapi } from '@/app/api/uploadthing/utapi';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { absoluteUrl } from '@/lib/utils';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import { PLANS } from '@/config/stripe';
import { File, User } from '@prisma/client';

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id || !user.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email
        }
      });
    }

    return { success: true };
  }),
  createStripeSession: privateProcedure.mutation(
    async ({ ctx }) => {
      const { userId } = ctx

      const billingUrl = absoluteUrl('/dashboard/billing')

      if (!userId)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      }) as User | null;

      if (!dbUser)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      const subscriptionPlan =
        await getUserSubscriptionPlan()

      if (
        subscriptionPlan.isSubscribed &&
        dbUser.stripeCustomerId
      ) {
        const stripeSession =
          await stripe.billingPortal.sessions.create({
            customer: dbUser.stripeCustomerId,
            return_url: billingUrl,
          })

        return { url: stripeSession.url }
      }

      const stripeSession =
        await stripe.checkout.sessions.create({
          success_url: billingUrl,
          cancel_url: billingUrl,
          payment_method_types: ['card', 'link'],
          mode: 'subscription',
          billing_address_collection: 'auto',
          line_items: [
            {
              price: PLANS.find(
                (plan) => plan.name === 'Pro'
              )?.price.priceIds.test,
              quantity: 1,
            },
          ],
          metadata: {
            userId: userId,
          },
        })

      return { url: stripeSession.url }
    }
  ),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const files = await db.file.findMany({
      where: {
        userId
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    return files.map(file => ({
      ...file,
      mostRecentMessage: file.messages[0] || null
    }));
  }),
  getFile: privateProcedure.input(z.object({ key: z.string(), })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    const file = await db.file.findFirst({
      where: {
        key: input.key,
        userId
      }
    });

    if (!file) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' });
    }

    return file;
  }),
  getFileUploadStatus: privateProcedure.input(z.object({ fileId: z.string(), })).query(async ({ ctx, input }) => {
    const file = await db.file.findFirst({
      where: {
        id: input.fileId,
        userId: ctx.userId
      }
    }) as File | null;

    if (!file) {
      return { status: "Pending" as const };
    }

    return { status: file.uploadStatus };
  }),
  getFileMessages: privateProcedure.input(z.object({
    fileId: z.string(),
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
  })).query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { fileId, cursor } = input;
    const limit = input.limit ?? INFINITE_QUERY_LIMIT;

    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId
      }
    });

    if (!file) throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' });

    const messages = await db.message.findMany({
      where: {
        fileId,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        isUserMessage: true,
        createdAt: true,
        text: true,
      }
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (messages.length > limit) {
      nextCursor = messages.pop()!.id;
    }

    return {
      messages,
      nextCursor
    };
  }),
  deleteFile: privateProcedure.input(z.object({ id: z.string(), key: z.string(), })).mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    const file = db.file.findFirst({
      where: {
        id: input.id,
        userId,
      }
    });

    if (!file) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' });
    }

    // Delete on UploadThing
    try {
      await utapi.deleteFiles(input.key);
    } catch (error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete file on UploadThing' });
    }

    await db.file.delete({
      where: {
        id: input.id
      }
    });

    return file;
  }),
});

export type AppRouter = typeof appRouter;