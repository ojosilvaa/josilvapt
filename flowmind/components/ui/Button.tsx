import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: Props) {
  const base = 'font-bold rounded-xl transition-all duration-200 cursor-pointer border-0 font-jakarta disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = { sm: 'px-5 py-2.5 text-[13px]', md: 'w-full py-[15px] text-[15px]' }
  const variants = {
    primary: 'bg-fm-green text-white hover:bg-[#00b085] active:scale-[0.98]',
    secondary: 'bg-fm-bg4 text-fm-text border border-fm-border2 hover:bg-fm-bg3',
    ghost: 'bg-transparent text-fm-green hover:bg-fm-green/10',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
