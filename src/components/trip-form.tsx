'use client'

import { useState } from 'react'
import type { Trip } from '@/types/trip'
import { TripFormField } from './trip-form-field'

type TripFormProps = {
  mode?: 'create' | 'edit'
  initialValues?: Pick<Trip, 'name' | 'destination' | 'note'>
  onSubmit?: (values: Pick<Trip, 'name' | 'destination' | 'note'>) => void | Promise<void>
}

export function TripForm({ mode = 'create', initialValues, onSubmit }: TripFormProps) {
  const [name, setName] = useState(mode === 'edit' ? initialValues?.name ?? '' : '')
  const [destination, setDestination] = useState(mode === 'edit' ? initialValues?.destination ?? '' : '')
  const [note, setNote] = useState(mode === 'edit' ? initialValues?.note ?? '' : '')
  const disabled = name.trim().length === 0
  return (
    <form className="leading-[normal]" onSubmit={(event) => {
      event.preventDefault()
      if (!disabled) onSubmit?.({ name: name.trim(), destination, note })
    }}>
      <div className="mt-3.5">
        <h1 className="font-ui text-screen-title font-bold tracking-tight text-heading">{mode === 'edit' ? '編輯旅行收藏' : '建立旅行收藏'}</h1>
        <p className="mt-2 max-w-[304px] font-kr text-body-sm leading-kr text-copy-kr">
          {mode === 'edit' ? '名稱、目的地與說明都可以隨時修改，收藏裡的地點不受影響。' : '先取個名字就能開始收集地點，其他欄位之後都能補。'}
        </p>
      </div>
      <div className="relative mt-[18px]">
        <div aria-hidden="true" className="pointer-events-none absolute -top-2 left-7 z-2 h-4 w-[58px] -rotate-6 rounded-[2px] bg-tape-butter opacity-92" />
        <div className="flex min-w-0 flex-col gap-4 rounded-lg bg-card p-[18px] shadow-card">
          <TripFormField id="trip-name" label="收藏名稱" required>
            <input
              id="trip-name" type="text" aria-required="true"
              aria-describedby={disabled ? 'trip-name-hint' : undefined}
              placeholder="例如：京都的秋天" value={name}
              onChange={(event) => setName(event.target.value)}
              className="block h-12 w-full min-w-0 rounded-sm border-[1.5px] border-[#E3D9C6] bg-app px-3 font-kr text-body text-heading outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
            />
            <div className="mt-[7px] min-h-[18.6px]">
              {disabled && <p id="trip-name-hint" role="status" className="font-kr text-caption leading-body text-heading">先填收藏名稱，才能{mode === 'edit' ? '儲存' : '建立'}。</p>}
            </div>
          </TripFormField>
          <TripFormField id="trip-dest" label="目的地名稱">
            <input
              id="trip-dest" type="text" placeholder="例如：日本 京都" value={destination}
              onChange={(event) => setDestination(event.target.value)}
              className="block h-12 w-full min-w-0 rounded-sm border-[1.5px] border-[#E3D9C6] bg-app px-3 font-kr text-body text-heading outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
            />
          </TripFormField>
          <TripFormField id="trip-note" label="收藏說明">
            <textarea
              id="trip-note" placeholder="這趟旅行想留下什麼？主題或感受都可以。" value={note}
              onChange={(event) => setNote(event.target.value)}
              className="block min-h-[82px] w-full min-w-0 resize-none overflow-y-auto rounded-sm border-[1.5px] border-[#E3D9C6] bg-app px-3 py-[11px] font-kr text-body-sm leading-kr text-heading outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
            />
            <p className="mt-[7px] font-kr text-[11.5px] leading-body text-muted">用來描述旅行的主題或感受；不影響分類、篩選或地圖。</p>
          </TripFormField>
        </div>
      </div>
      <button
        type="submit" disabled={disabled} aria-describedby={disabled ? 'trip-name-hint' : undefined}
        className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-md border-[1.5px] border-accent-strong bg-accent-strong px-5 font-ui text-[15px] font-bold text-on-accent shadow-[0_2px_6px_rgba(60,95,160,0.16)] transition duration-120 ease-soft outline-focus focus-visible:outline-2 focus-visible:outline-offset-2 active:enabled:scale-97 active:enabled:brightness-[.96] disabled:cursor-default disabled:opacity-45 motion-reduce:transform-none motion-reduce:transition-none"
      >{mode === 'edit' ? '儲存變更' : '建立收藏'}</button>
    </form>
  )
}
