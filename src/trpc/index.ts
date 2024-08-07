import { privateProcedure, publicProcedure, router } from './trpc';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { db } from '@/db';
import { z } from 'zod';
import { utapi } from '@/app/api/uploadthing/utapi.ts';

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
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await db.file.findMany({
      where: {
        userId
      }
    });
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