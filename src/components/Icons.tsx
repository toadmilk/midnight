import { User } from 'lucide-react';
import Image from 'next/image';
import { ReactNode } from 'react';

export const Icons = {
  user: User,
  logo: (): ReactNode => {
    return <Image src="/logo.svg" alt="Logo" width={24} height={24} />;
  }
}