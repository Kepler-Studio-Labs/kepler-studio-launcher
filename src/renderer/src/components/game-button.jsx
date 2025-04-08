import { HardDriveIcon } from 'lucide-react'
import { useLauncherStore } from '../store/useLauncherStore'
import { CloudDownloadIcon } from 'lucide-react'
import { useEffect } from 'react'
import { GamepadIcon } from 'lucide-react'

export const GameButton = () => {
  const { installedVersion, needsUpdate, fetchVersions, startDownload, state, bootstrap } =
    useLauncherStore()

  useEffect(() => {
    fetchVersions()
  }, [fetchVersions])

  const handleClick = () => {
    if (installedVersion === null) {
      startDownload()
    } else if (installedVersion !== null && needsUpdate) {
      startDownload()
    } else if (installedVersion !== null && !needsUpdate && state !== 'ingame') {
      bootstrap()
    } else if (installedVersion !== null && !needsUpdate && state === 'ingame') {
      // stopGame()
    } else {
      alert('erreur')
    }
  }

  return (
    <button
      className="p-2 px-6 rounded-full bg-violet-500 hover:bg-violet-700 disabled:bg-white/25 text-white disabled:text-neutral-500 font-semibold flex items-center gap-2 cursor-pointer"
      onClick={handleClick}
      disabled={!['idle', 'ready'].includes(state)}
    >
      {installedVersion === null && (
        <>
          <HardDriveIcon /> Installer
        </>
      )}

      {installedVersion !== null && needsUpdate && (
        <>
          <CloudDownloadIcon /> Mettre à jour
        </>
      )}

      {installedVersion !== null && !needsUpdate && state !== 'ingame' && (
        <>
          <GamepadIcon /> Jouer
        </>
      )}

      {installedVersion !== null && !needsUpdate && state === 'ingame' && (
        <>
          <GamepadIcon className="w-4 h-4" /> En cours d&apos;exécution
        </>
      )}
    </button>
  )
}
