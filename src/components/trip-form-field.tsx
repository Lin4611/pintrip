import type { ReactNode } from 'react'

export function TripFormField({ id, label, required = false, children }: {
  id: string
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center gap-[7px]">
        <label htmlFor={id} className="font-ui text-[11px] font-bold tracking-[.1em] text-muted">{label}</label>
        <span className={`rounded-pill px-[7px] py-0.5 font-ui text-[10.5px] font-bold text-heading ${required ? 'bg-coral-100' : 'bg-cream-200'}`}>
          {required ? '必填' : '選填'}
        </span>
      </div>
      {children}
    </div>
  )
}
