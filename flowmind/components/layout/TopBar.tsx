'use client'

interface Props {
  streak: number
  initials: string
  onProfileClick: () => void
}

export function TopBar({ streak, initials, onProfileClick }: Props) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-fm-bg2 border-b border-fm-border sticky top-0 z-10">
      <div className="text-[20px] font-bold text-fm-green tracking-tight">
        Flow<span className="text-fm-text2 font-normal">Mind</span>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] rounded-full px-[11px] py-1.5 text-[12px] font-semibold text-fm-amber">
          🔥 {streak} dias
        </div>
        <button
          onClick={onProfileClick}
          className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-fm-green to-[#0088cc] flex items-center justify-center text-[13px] font-bold text-white cursor-pointer border-0"
        >
          {initials}
        </button>
      </div>
    </div>
  )
}
