'use client';

import { ArrowRight, CreditCard, Gem, LayoutDashboard, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUserSubscriptionPlan } from '@/lib/stripe';

interface MobileNavProps {
  isAuth: boolean;
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const MobileNav = ({ isAuth, subscriptionPlan }: MobileNavProps) => {

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const path = usePathname();

  const toggleOpen = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  }

  useEffect(() => {
    if(isMobileNavOpen) {
      toggleOpen();
    }
  }, [path]);

  const closeOnCurrent = (href: string) => {
    if (path === href) {
      toggleOpen();
    }
  }

  return (
    <>
      <div className="sm:hidden">
        <Menu
          onClick={toggleOpen}
          className="relative z-50 h-5 w-5 text-neutral-700 dark:text-neutral-300"
        />

        {isMobileNavOpen ? (
          <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
            <ul className="absolute bg-background border-b border-neutral-200 dark:border-neutral-800 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
              {!isAuth ? (
                <>
                  <li>
                    <Link
                      onClick={() => closeOnCurrent('/sign-up')}
                      href="/sign-up"
                      className="flex items-center w-full font-semibold text-indigo-600"
                    >
                      Get started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </li>
                  <li className="my-3 h-px w-full bg-neutral-300 dark:bg-neutral-700" />
                  <li>
                    <Link
                      onClick={() => closeOnCurrent('/sign-in')}
                      href="/sign-in"
                      className="flex items-center w-full font-semibold"
                    >
                      Sign in <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </li>
                  <li className="my-3 h-px w-full bg-neutral-300 dark:bg-neutral-700" />
                  <li>
                    <Link
                      onClick={() => closeOnCurrent('/pricing')}
                      href="/pricing"
                      className="flex items-center w-full font-semibold"
                    >
                      Pricing <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      onClick={() => closeOnCurrent('/dashboard')}
                      href="/dashboard"
                      className="flex items-center w-full font-semibold"
                    >
                      Dashboard <LayoutDashboard className="ml-2 h-5 w-5" />
                    </Link>
                  </li>
                  <li className="my-3 h-px w-full bg-neutral-300 dark:bg-neutral-700" />
                  <li>
                    {subscriptionPlan?.isSubscribed ? (
                      <Link href="/dashboard/billing" className="flex items-center w-full font-semibold">
                        Manage Subscription <CreditCard className="ml-2 h-5 w-5" />
                      </Link>
                    ) : (
                      <Link href="/pricing">
                        <div className="flex items-center w-full font-semibold">
                          Upgrade{' '}
                          <Gem className="text-indigo-600 ml-2 h-5 w-5" />
                        </div>
                      </Link>
                    )}
                  </li>
                  <li className="my-3 h-px w-full bg-neutral-300 dark:bg-neutral-700" />
                  <li>
                    <Link
                      href="/sign-out"
                      className="flex items-center w-full font-semibold"
                    >
                      Sign out <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default MobileNav;