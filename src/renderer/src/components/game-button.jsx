import { HardDriveIcon } from 'lucide-react'
import { useLauncherStore } from '../store/useLauncherStore'
import { CloudDownloadIcon } from 'lucide-react'
import { useEffect } from 'react'
import { GamepadIcon } from 'lucide-react'
import PropTypes from 'prop-types'

export const GameButton = ({ gameId }) => {
  const { installedVersions, needsUpdate, fetchVersions, startDownload, state, bootstrap } =
    useLauncherStore()

  useEffect(() => {
    fetchVersions(gameId)
  }, [fetchVersions, gameId])

  const handleClick = () => {
    if (installedVersions[gameId] === null) {
      startDownload(gameId)
    } else if (installedVersions[gameId] !== null && needsUpdate[gameId]) {
      startDownload(gameId)
    } else if (installedVersions[gameId] !== null && !needsUpdate[gameId] && state !== 'ingame') {
      bootstrap(gameId)
    } else if (installedVersions[gameId] !== null && !needsUpdate[gameId] && state === 'ingame') {
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
      {installedVersions[gameId] === null && (
        <>
          <HardDriveIcon /> Installer
        </>
      )}

      {installedVersions[gameId] !== null && needsUpdate[gameId] && (
        <>
          <CloudDownloadIcon /> Mettre à jour
        </>
      )}

      {installedVersions[gameId] !== null && !needsUpdate[gameId] && state !== 'ingame' && (
        <>
          <GamepadIcon /> Jouer
        </>
      )}

      {installedVersions[gameId] !== null && !needsUpdate[gameId] && state === 'ingame' && (
        <>
          <GamepadIcon className="w-4 h-4" /> En cours d&apos;exécution
        </>
      )}
    </button>
  )
}

GameButton.propTypes = {
  gameId: PropTypes.string.isRequired
}
