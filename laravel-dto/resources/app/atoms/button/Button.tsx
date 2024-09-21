import {cn} from '@/utils/index';
import {SvgIcon} from '@/atoms/index';

interface ButtonProps {
  size: 'sm' | 'md' | 'lg' | 'full';
  type?: 'button' | 'submit';
  color: 'primary';
  style: 'solid' | 'outline';
  text: string;
  isFull?: boolean;
  icon?: string;
  onClick?: () => void;
}

function Button({size, type = 'button', color, style, text, isFull, icon, onClick}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg',
        {
          'h-8 px-4 py-0.5': size === 'sm',
          'h-10 px-5 py-2': size === 'md',
          'w-full': isFull,
        },
        {
          'bg-gradient-to-r from-primary to-primary/70 text-white': color === 'primary' && style === 'solid',
        },
        {
          'border border-primary text-primary': color === 'primary' && style === 'outline',
        },
      )}
      onClick={onClick}>
      {icon && <SvgIcon iconName={icon} size={16} weight="bold" />}
      <span>{text}</span>
    </button>
  );
}

export default Button;
