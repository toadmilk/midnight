"use client";

import Messages from '@/components/chat/Messages';
import ChatInput from '@/components/chat/ChatInput';
import { trpc } from '@/app/_trpc/client';
import { ChevronLeft, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {

    const { data, isLoading } = trpc.getFileUploadStatus.useQuery({
        fileId
      }, {
        refetchInterval: (data) =>
          data?.status === "Success" ||
          data?.status === "Failed" ? false : 500
      }
    );

    if (isLoading) {
      return (
        <div className="relative min-h-full bg-background flex divide-y divide-neutral-200 dark:divide-neutral-800 flex-col justify-between gap-2">
          <div className="flex-1 flex justify-center items-center mb-28">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500"/>
              <h3 className="font-semibold text-xl">Loading...</h3>
              <p className="text-neutral-500 text-sm">
                We&apos;re preparing your document.
              </p>
            </div>
          </div>

          <ChatInput isDisabled/>
        </div>
      );
    }

    if (data?.status === "Processing") {
      return (
        <div className="relative min-h-full bg-background flex divide-y divide-neutral-200 dark:divide-neutral-800 flex-col justify-between gap-2">
          <div className="flex-1 flex justify-center items-center mb-28">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500"/>
              <h3 className="font-semibold text-xl">Processing Document...</h3>
              <p className="text-neutral-500 text-sm">
                This won&apos;t take long.
              </p>
            </div>
          </div>

          <ChatInput isDisabled/>
        </div>
      );
    }

    if (data?.status === "Failed") {
      return (
        <div className="relative min-h-full bg-background flex divide-y divide-neutral-200 dark:divide-neutral-800 flex-col justify-between gap-2">
          <div className="flex-1 flex justify-center items-center mb-28">
            <div className="flex flex-col items-center gap-2">
              <XCircle className="w-8 h-8 text-red-500"/>
              <h3 className="font-semibold text-xl">Too many pages in document</h3>
              <p className="text-neutral-500 text-sm">
                Your <span className="font-medium">Free</span> plan supports up to 5 pages per document.
              </p>
              <Link
                href="/dashboard"
                className={buttonVariants({
                  variant: "secondary",
                  className: "mt-4"
                })}
              >
                <ChevronLeft className="h-3 w-3 mr-1.5"/>
                Back
              </Link>
            </div>
          </div>

          <ChatInput isDisabled/>
        </div>
      );
    }

    return (
      <div className="relative min-h-full bg-background flex divide-y divide-neutral-200 dark:divide-neutral-800 justify-between gap-2">
        <div className="flex-1 justify-between flex flex-col mb-28">
          <Messages/>
        </div>

        <ChatInput isDisabled={!isLoading} />
      </div>
    );
  }
;

export default ChatWrapper;