"use server";

import UserAccountNav from './UserAccountNav';
import { getUserSubscriptionPlan } from '@/lib/stripe';

export default async function UserAccountNavWrapper() {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <UserAccountNav
      name="User Name"
      email="user@example.com"
      imageUrl="/path-to-image"
      subscriptionPlan={subscriptionPlan}
    />
  );
}