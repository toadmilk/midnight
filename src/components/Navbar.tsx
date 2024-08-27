import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import { DATA } from "@/data/data";
import { buttonVariants } from "@/components/ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import UserAccountNav from '@/components/UserAccountNav';
import UserAccountNavWrapper from '@/components/UserAccountNavWrapper';

const Navbar = async () => {

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-grey-200 dark:border-grey-800 bg-white/75 dark:bg-black/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-grey-200 dark:border-grey-800'>
          <Link href='/' className='flex z-40 font-semibold items-center'>
            <Image src='/logo.svg' alt='logo' className="pr-2" width={28} height={28}/>
            {DATA.appName}
          </Link>

          {/* TODO: add mobile navbar */}

          <div className='hidden items-center space-x-4 sm:flex'>
            {!user ? (
              <>
                <Link
                  href='/pricing'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
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
                  Get started{' '}
                  <ArrowRight className='ml-1.5 h-5 w-5' />
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href='/dashboard'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Dashboard
                </Link>

                <UserAccountNavWrapper
                  name={
                    !user.given_name || !user.family_name
                      ? 'Your Account'
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email ?? ''}
                  imageUrl={user.picture ?? ''}
                />
              </>
            )}
          </div>
        </div>

      </MaxWidthWrapper>

    </nav>
  )
}

export default Navbar;