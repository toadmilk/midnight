import { privateProcedure, publicProcedure, router } from './trpc';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { db } from '@/db';

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
  getUserFiles: privateProcedure.query( ({ ctx }) => {
    const { userId } = ctx;

    return db.file.findMany({
      where: {
        userId
      }
    });
  }),
  getUser: privateProcedure.query( ({ ctx }) => {
    const { userId } = ctx;

    return db.user.findFirst({
      where: {
        id: userId
      }
    });
  }),
});

export type AppRouter = typeof appRouter;