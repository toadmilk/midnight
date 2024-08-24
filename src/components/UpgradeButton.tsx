import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';


const UpgradeButton = () => {
  return (
    <Button className="w-full">
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};

export default UpgradeButton;