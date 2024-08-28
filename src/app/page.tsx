import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { DATA } from "@/data/data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <NeonGradientCard className="max-w-sm justify-center bg-transparent mb-8" borderRadius={50}>
          <span className="pointer-events-none z-10 h-full bg-gradient-to-br from-[#FF00FE] from-35% to-[#1000FF] bg-clip-text text-center text-2xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            {DATA.appName} is now public!
          </span>
        </NeonGradientCard>
        <h1 className="max-width-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Transform your <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>Scripts</span> into <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>Shorts</span> in minutes.
        </h1>
        <p className="mt-5 max-w-prose text-grey-300 dark:text-grey-700 sm:text-lg">
          Chat with and edit your scripts, fine-tune the result or make manual edits, and effortlessly create short-form content.
        </p>

        <Link className={buttonVariants({
          size: 'lg',
          className: 'mt-5',
        })} href="/sign-in" target="_blank">
          Get started
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </MaxWidthWrapper>
      <div className="relative isolate">
        <div aria-hidden="true" className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-2xl sm:-top-80'>
          <div style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }} className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FF00FE] to-[#1000FF] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
          />
        </div>

        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-neutral-900/5 p-2 ring-1 ring-inset ring-neutral-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/dashboard-preview.png"
                alt="product preview"
                width={1920}
                height={1080}
                quality={100}
                className="rounded-md bg-background p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-neutral-900/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl sm:text-5xl text-neutral-900 dark:text-neutral-100">
              Start chatting in minutes
            </h2>
            <p className="mt-4 text-lg texy-neutral-500">
              Creating from your files has never been easier than with {DATA.appName}.
            </p>
          </div>
        </div>

        {/* Steps */}
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 dark:border-zinc-700 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-indigo-600">Step 1</span>
              <span className="text-xl font-semibold">Sign up for an account</span>
              <span className="mt-2 text-neutral-700 dark:text-neutral-300">
                Either starting out with a free plan or choose our{' '}
                <Link
                  href="/pricing"
                  className="text-indigo-600 underline underline-offset-2"
                >
                  pro plan
                </Link>.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 dark:border-zinc-700 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-indigo-600">Step 2</span>
              <span className="text-xl font-semibold">Upload your document</span>
              <span className="mt-2 text-neutral-700 dark:text-neutral-300">
                Ask questions, get feedback and fine-tune the final script.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 dark:border-zinc-700 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-indigo-600">Step 3</span>
              <span className="text-xl font-semibold">Create short-form content</span>
              <span className="mt-2 text-neutral-700 dark:text-neutral-300">
                Generate high-quality content from your final script. Try out {DATA.appName} today - it really takes less than 10 minutes.
              </span>
            </div>
          </li>
        </ol>
      </div>
      <div className="relative isolate">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="my-16 flow-root sm:my-24">
            <div className="-m-2 rounded-xl bg-neutral-900/5 p-2 ring-1 ring-inset ring-neutral-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/file-upload-preview.png"
                alt="product preview"
                width={1920}
                height={1080}
                quality={100}
                className="rounded-md bg-background p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-neutral-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}