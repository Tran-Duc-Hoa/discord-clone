import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Props {
  src?: string;
  className?: string;
  fallback?: string;
}

const UserAvatar = ({ src, className, fallback }: Props) => {
  return (
    <Avatar className={cn('w-7 h-7 md:h-10 md:w-10', className)}>
      <AvatarImage src={src} alt="" />
      {fallback && <AvatarFallback>{fallback}</AvatarFallback>}
    </Avatar>
  );
};

export default UserAvatar;
