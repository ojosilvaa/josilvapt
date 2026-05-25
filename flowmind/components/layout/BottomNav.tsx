'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  onAddClick: () => void
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: '⌂' },
  { href: '/dashboard/gastos', label: 'Gastos', icon: '☰' },
]

const NAV_ITEMS_RIGHT = [
  { href: '/dashboard/metas', label: 'Metas', icon: '⊙' },
  { href: '/dashboard/analise', label: 'Análise', icon: '▤' },
]

export function BottomNav({ onAddClick }: Props) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  const itemClass = (href: string) =>
    `flex-1 flex flex-col items-center py-2.5 pb-3 cursor-pointer gap-1 ${isActive(href) ? 'text-fm-green' : 'text-fm-text3'}`

  return (
    <div className="flex bg-fm-bg2 border-t border-fm-border fixed bottom-0 w-full max-w-[480px] z-20">
      {NAV_ITEMS.map(item => (
        <Link key={item.href} href={item.href} className={itemClass(item.href)}>
          <span className="text-[22px] leading-none">{item.icon}</span>
          <span className="text-[10px]">{item.label}</span>
        </Link>
      ))}
      <div className="flex-1 flex items-center justify-center pb-1">
        <button
          onClick={onAddClick}
          className="w-[50px] h-[50px] bg-fm-green rounded-full flex items-center justify-center text-white text-[24px] cursor-pointer border-0 shadow-[0_4px_20px_rgba(0,200,150,0.4)] hover:scale-105 transition-transform -mt-3.5"
          aria-label="Adicionar gasto"
        >
          +
        </button>
      </div>
      {NAV_ITEMS_RIGHT.map(item => (
        <Link key={item.href} href={item.href} className={itemClass(item.href)}>
          <span className="text-[22px] leading-none">{item.icon}</span>
          <span className="text-[10px]">{item.label}</span>
        </Link>
      ))}
    </div>
  )
}
