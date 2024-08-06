import ModeToggle from "@/components/mode-toggle";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import { DATA } from "@/data/data";
import { buttonVariants } from "@/components/ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowRight } from "lucide-react";


const Navbar = () => {
  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-grey-200 dark:border-grey-800 bg-white/75 dark:bg-black/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-grey-200 dark:border-grey-800'>
          <Link href='/' className='flex z-40 font-semibold'>
            {DATA.appName.toLowerCase()}.
          </Link>

          {/* TODO: add mobile navbar */}

          <div className='hidden items-center space-x-4 sm:flex'>
            <>
              <Link
                href='/pricing'
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                })}
              >
                Pricing
              </Link>
              <LoginLink
                className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}>
                Sign in
              </LoginLink>
              <RegisterLink
                className={buttonVariants({
                  size: 'sm',
                })}>
                Get started <ArrowRight className='ml-1.5 h-5 w-5'/>
              </RegisterLink>
            </>
            <ModeToggle/>
          </div>
        </div>
      </MaxWidthWrapper>

    </nav>
  )
}

export default Navbar;