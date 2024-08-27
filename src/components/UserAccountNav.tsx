"use client";

import { getUserSubscriptionPlan } from '@/lib/stripe';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { Icons } from '@/components/Icons';
import Link from 'next/link';
import { Gem } from 'lucide-react';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs';

interface UserAccountNavProps {
  name: string;
  email: string | undefined;
  imageUrl: string;
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const UserAccountNav = async ({ name, email, imageUrl, subscriptionPlan }: UserAccountNavProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="overflow-visible"
      >
        <Button className="rounded-full h-8 w-8 aspect-square bg-neutral-400 dark:bg-neutral-600">
          <Avatar className="relative w-8 h-8">
            {imageUrl ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  src={imageUrl}
                  alt={name}
                  className="rounded-full"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{name}</span>
                <Icons.user className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
              </AvatarFallback>)
            }
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-background" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {name ? (
                <p className="font-medium text-sm">{name}</p>
              ) :
              null
            }
            {email ? (
                <p className="w-[200px] truncate text-xs text-neutral-700 dark:text-neutral-300">{email}</p>
              ) :
              null
            }
          </div>
        </div>

        <DropdownMenuSeparator/>

        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {subscriptionPlan?.isSubscribed ? (
            <Link href="/dashboard/billing">Manage Subscription</Link>
          ) : (
            <Link href="/pricing">Upgrade <Gem className="text-indigo-600 h-4 w-4 ml-1.5"/></Link>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator/>

        <DropdownMenuItem className="cursor-pointer">
          <LogoutLink>Log out</LogoutLink>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;