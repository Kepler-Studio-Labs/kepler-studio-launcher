import { HardDriveIcon } from 'lucide-react'
import { useLauncherStore } from '../store/useLauncherStore'
import { CloudDownloadIcon } from 'lucide-react'
import { useEffect } from 'react'
import { GamepadIcon } from 'lucide-react'
import PropTypes from 'prop-types'
import { Button } from './ui/button'

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
    <Button
      className="group relative overflow-hidden bg-white/25 cursor-pointer"
      size="lg"
      onClick={handleClick}
      disabled={!['idle', 'ready'].includes(state)}
    >
      {installedVersions[gameId] === null && (
        <>
          <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0 z-10">
            Installer
          </span>
          <i className="absolute right-1 top-1 bottom-1 rounded-sm z-20 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
            <HardDriveIcon className="w-6 h-6" strokeWidth={2} aria-hidden="true" />
          </i>
        </>
      )}
      {installedVersions[gameId] !== null && needsUpdate[gameId] && (
        <>
          <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0 z-10">
            Mettre à jour
          </span>
          <i className="absolute right-1 top-1 bottom-1 rounded-sm z-20 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
            <CloudDownloadIcon className="w-6 h-6" strokeWidth={2} aria-hidden="true" />
          </i>
        </>
      )}
      {installedVersions[gameId] !== null && !needsUpdate[gameId] && state !== 'ingame' && (
        <>
          <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0 z-10 text-white">
            Jouer
          </span>
          <i className="absolute right-1 top-1 bottom-1 rounded-sm z-20 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
            <GamepadIcon className="w-6 h-6" strokeWidth={2} aria-hidden="true" />
          </i>
        </>
      )}
      {installedVersions[gameId] !== null && !needsUpdate[gameId] && state === 'ingame' && (
        <>
          <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0 z-10 text-white">
            En cours d&apos;exécution
          </span>
          <i className="absolute right-1 top-1 bottom-1 rounded-sm z-20 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
            <GamepadIcon className="w-6 h-6" strokeWidth={2} aria-hidden="true" />
          </i>
        </>
      )}
    </Button>
  )
}

GameButton.propTypes = {
  gameId: PropTypes.string.isRequired
}
