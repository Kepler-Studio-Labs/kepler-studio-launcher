import { DotIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LauncherState } from './launcher-state'

function Header() {
  const [username, setUsername] = useState('')

  useEffect(() => {
    window.api.getAuthData().then((authData) => {
      setUsername(authData.name)
    })
  }, [])

  return (
    <header className="w-full flex items-center justify-between">
      <div className="bg-black/50 rounded-full p-2 px-5 flex flex-col">
        <span className="text-xs text-neutral-300">Status des services</span>
        <p className="flex items-center gap-1 font-semibold text-sm">
          <DotIcon className="w-4 h-4 scale-200 text-green-500 animate-pulse" strokeWidth={3} /> En
          ligne
        </p>
      </div>
      <LauncherState />
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <p className="font-semibold">{username}</p>
          <span className="text-sm text-neutral-500 font-semibold">Niveau 1</span>
        </div>
        <img
          src={`https://mc-heads.net/avatar/${username}/100`}
          alt={`${username} avatar`}
          className="w-12 h-12 rounded-full"
        />
      </div>
    </header>
  )
}

export default Header
