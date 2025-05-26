import { cva } from 'class-variance-authority';

export const avatarVariants = cva('relative inline-block overflow-hidden', {
  variants: {
    variant: {
      rounded: 'rounded',
      circle: 'rounded-full',
      square: 'rounded-none',
    },
    size: {
      xs: 'h-6 w-6',
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-14 w-14',
    },
  },
  defaultVariants: {
    variant: 'circle',
    size: 'md',
  },
});
