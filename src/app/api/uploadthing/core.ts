import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { DATA } from '@/data/data';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { pinecone } from '@/lib/pinecone';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { subscription } from 'swr/subscription';
import { PLANS } from '@/config/stripe';

const f = createUploadthing();

const uploaderMiddleware = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    throw new UploadThingError('Unauthorized');
  }

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { userId: user.id, subscriptionPlan };
};

const uploaderOnUploadComplete = async ({
                                          metadata, file,
                                        }: {
  metadata: Awaited<ReturnType<typeof uploaderMiddleware>>
  file: {
    key: string,
    name: string,
    url: string,
  }
}) => {

  const doesFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });

  if (doesFileExist) {
    return;
  }

  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: `${DATA.uploadThingUrl}${file.key}`,
      uploadStatus: 'Processing',
    },
  });

  try {
    const response = await fetch(`${DATA.uploadThingUrl}${file.key}`);
    const blob = await response.blob();

    const loader = new PDFLoader(blob);

    const pageLevelDocs = await loader.load();

    const pagesAmt = pageLevelDocs.length;

    const { subscriptionPlan } = metadata;
    const { isSubscribed } = subscriptionPlan;

    const isProExceeded = pagesAmt > PLANS.find((plan) => plan.name === 'Pro')!.pagesPerPdf;
    const isFreeExceeded = pagesAmt > PLANS.find((plan) => plan.name === 'Free')!.pagesPerPdf;

    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        data: {
          uploadStatus: 'Failed',
        },
        where: {
          id: createdFile.id,
        },
      });
    }

    const pineconeIndex = pinecone.Index('midnight');

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: createdFile.id,
    });

    await db.file.update({
      data: {
        uploadStatus: 'Success',
      },
      where: {
        id: createdFile.id,
      },
    });
  } catch (err) {
    await db.file.update({
      data: {
        uploadStatus: 'Failed',
      },
      where: {
        id: createdFile.id,
      },
    });
  }
};

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(uploaderMiddleware)
    .onUploadComplete(uploaderOnUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: '16MB' } })
    .middleware(uploaderMiddleware)
    .onUploadComplete(uploaderOnUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;