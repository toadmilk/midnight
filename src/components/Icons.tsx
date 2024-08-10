import { LucideProps, User } from 'lucide-react';

export const Icons = {
  user: User,
  // For logo user /logo.svg
  logo: (props: LucideProps) => {
    return <img src="/logo.svg" alt="Logo" {...props} />;
  }
}