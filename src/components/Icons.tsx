import { User } from 'lucide-react';
import Image from 'next/image';
import { ReactNode } from 'react';

export const Icons = {
  user: User,
  logo: (): ReactNode => {
    return <Image src="/logo.svg" alt="Logo" className="h-3/4 w-3/4" />;
  }
}