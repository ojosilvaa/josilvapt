import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', ...props }: Props) {
  return (
    <div className="mb-[14px]">
      {label && <div className="text-[12px] text-fm-text2 font-medium mb-1.5">{label}</div>}
      <input
        className={`w-full bg-fm-bg4 border border-fm-border2 rounded-[10px] px-[14px] py-3 text-[15px] text-fm-text font-jakarta outline-none transition-all duration-200 focus:border-fm-green placeholder:text-fm-text3 ${className}`}
        {...props}
      />
    </div>
  )
}
