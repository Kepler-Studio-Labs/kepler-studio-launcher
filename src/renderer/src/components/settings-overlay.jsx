import clsx from 'clsx'
import { BracesIcon, CpuIcon, SettingsIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import pikastress from '../assets/pikastres.webp'
import victini from '../assets/victini.gif'
import RamSlider from './ram-slider'

export function SettingsOverlay() {
  const [tab, setTab] = useState('general')
  const [open, setOpen] = useState(false)

  return (
    <div
      className={clsx(
        'top-0 left-0 w-full h-full bg-black/50 z-50 backdrop-blur-md',
        open ? 'fixed' : 'hidden'
      )}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-2xl p-4 bg-black rounded-lg space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">Options</h2>
              <p className="text-sm text-neutral-400">Paramétrez Cobblemon: New Era</p>
            </div>
            <button
              className="p-2 px-2 rounded-full bg-white/10 hover:bg-white/25 text-transparent font-semibold flex items-center gap-2 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <XIcon className="w-4 h-4 text-white" strokeWidth={2} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              className={clsx(
                'p-2 px-4 rounded-full font-semibold flex items-center gap-2 cursor-pointer',
                tab === 'general'
                  ? 'bg-white/100 text-black'
                  : 'bg-white/10 hover:bg-white/25 text-white'
              )}
              onClick={() => setTab('general')}
            >
              <SettingsIcon className="w-4 h-4" strokeWidth={2} /> Général
            </button>
            <button
              className={clsx(
                'p-2 px-4 rounded-full font-semibold flex items-center gap-2 cursor-pointer',
                tab === 'performance'
                  ? 'bg-white/100 text-black'
                  : 'bg-white/10 hover:bg-white/25 text-white'
              )}
              onClick={() => setTab('performance')}
            >
              <CpuIcon className="w-4 h-4" strokeWidth={2} /> Performance
            </button>
            <button
              className={clsx(
                'p-2 px-4 rounded-full font-semibold flex items-center gap-2 cursor-pointer',
                tab === 'dev'
                  ? 'bg-white/100 text-black'
                  : 'bg-white/10 hover:bg-white/25 text-white'
              )}
              onClick={() => setTab('dev')}
            >
              <BracesIcon className="w-4 h-4" strokeWidth={2} /> Développement
            </button>
          </div>
          {tab === 'general' && <GeneralTab />}
          {tab === 'performance' && <PerformanceTab />}
          {tab === 'dev' && <DevTab />}
        </div>
      </div>
    </div>
  )
}

function GeneralTab() {
  return (
    <div className="p-4 bg-white/10 rounded-lg">
      <p className="italic text-muted-foreground flex items-center gap-2">
        <img src={pikastress} alt="" className="w-16" /> Rien à voir ici pour le moment
      </p>
    </div>
  )
}

function PerformanceTab() {
  return (
    <div className="p-4 bg-white/10 rounded-lg relative">
      <div>
        <RamSlider />
      </div>
      <img src={victini} alt="" className="absolute bottom-0 right-4 w-16 h-20" />
    </div>
  )
}

function DevTab() {
  return (
    <div className="p-4 bg-white/10 rounded-lg">
      <p className="italic text-muted-foreground flex items-center gap-2">
        <img src={pikastress} alt="" className="w-16" /> Rien à voir ici pour le moment
      </p>
    </div>
  )
}
