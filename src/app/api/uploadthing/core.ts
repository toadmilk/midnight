import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { DATA } from '@/data/data';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pinecone } from '@/lib/pinecone';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const {getUser} = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `${DATA.uploadThingUrl}${file.key}`,
          uploadStatus: "Processing",
        }
      });

      try {
        const response = await fetch(`${DATA.uploadThingUrl}${file.key}`);
        const blob = await response.blob();

        const loader = new PDFLoader(blob);

        const pageLevelDocs = await loader.load();

        // TODO: Will be used to separate free from paid users later
        const pagesAmt = pageLevelDocs.length;

        const pineconeIndex = pinecone.Index("midnight");

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
        });

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id,
        });

        await db.file.update({
          data: {
            uploadStatus: "Success",
          },
          where: {
            id: createdFile.id,
          }
        });
      } catch (err) {
        await db.file.update({
          data: {
            uploadStatus: "Failed",
          },
          where: {
            id: createdFile.id,
          }
        })
        throw new Error("Failed to process file");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;