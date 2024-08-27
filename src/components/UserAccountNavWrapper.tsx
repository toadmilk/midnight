"use server";

import UserAccountNav from './UserAccountNav';
import { getUserSubscriptionPlan } from '@/lib/stripe';

interface UserAccountNavWrapperProps {
  name: string;
  email: string | undefined;
  imageUrl: string;
}

export default async function UserAccountNavWrapper({ name, email, imageUrl }: UserAccountNavWrapperProps) {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <UserAccountNav
      name={name}
      email={email}
      imageUrl={imageUrl}
      subscriptionPlan={subscriptionPlan}
    />
  );
}