import { DownloadIcon } from 'lucide-react'
import { useLauncherStore } from '../store/useLauncherStore'
import { CloudDownloadIcon } from 'lucide-react'
import { useEffect } from 'react'
import { GamepadIcon } from 'lucide-react'
import PropTypes from 'prop-types'
import { cn } from '../renderer-libs/utils'
import { Loader } from './loader'

export const GameButton = ({ gameId }) => {
  const {
    installedVersions,
    needsUpdate,
    fetchVersions,
    startDownload,
    state,
    bootstrap,
    progress,
    gameId: gameIdStore
  } = useLauncherStore()

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

  const isLaunchingButton = state === 'launching' && gameIdStore === gameId

  if (isLaunchingButton)
    return (
      <button className="max-w-sm w-full py-3 px-6  text-white font-mono uppercase tracking-wider rounded-lg relative overflow-hidden group transition-all duration-300">
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
            'opacity-50',
            'blur transition-opacity duration-500'
          )}
        />
        {progress < 100 && (
          <>
            <span className="z-20 font-medium text-from-left-animation opacity-100">
              <Loader className="inline-block w-5 h-5 mr-2" />
              Lancement ({progress}%)
            </span>
            <div
              className={cn(
                'absolute w-0 z-10 opacity-100 bottom-0 left-0 h-1 bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400 transition-all duration-200',
                `max-w-full min-w-0`
              )}
              style={{ width: `${progress}%` }}
            />
          </>
        )}
        {progress === 100 && (
          <>
            <span className="z-20 font-medium text-from-left-animation">
              <GamepadIcon className="inline-block w-5 h-5 mr-2" />
              En cours d&apos;exécution
            </span>
            <div className="absolute z-10 opacity-100 bottom-0 left-0 h-1 bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400 transition-all duration-200 w-full" />
          </>
        )}
      </button>
    )

  const isInstallButton = installedVersions[gameId] === null

  if (isInstallButton)
    return (
      <button
        className="cursor-pointer max-w-sm w-full py-3 px-6  text-white font-mono uppercase tracking-wider rounded-lg relative overflow-hidden group transition-all duration-300 disabled:opacity-50"
        onClick={handleClick}
        disabled={!['idle', 'ready'].includes(state)}
      >
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
            'opacity-80 group-hover:opacity-80',
            'blur transition-opacity duration-500'
          )}
        />
        {state === 'downloading' && gameIdStore === gameId && (
          <>
            <span className="z-20 font-medium text-from-left-animation">
              <Loader className="inline-block w-5 h-5 mr-2" />
              Téléchargement ({progress}%)
            </span>
            <div
              className={cn(
                'absolute w-0 z-10 opacity-100 bottom-0 left-0 h-1 bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400 transition-all duration-200',
                `max-w-full min-w-0`
              )}
              style={{ width: `${progress}%` }}
            />
          </>
        )}
        {state === 'unzipping' && gameIdStore === gameId && (
          <>
            <span className="z-20 font-medium text-from-left-animation">
              <Loader className="inline-block w-5 h-5 mr-2" />
              Décompression
            </span>
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400 group-hover:w-full transition-all duration-500" />
          </>
        )}
        {state === 'idle' && (
          <>
            <span className="z-20 font-medium text-from-left-animation">
              <DownloadIcon className="inline-block w-5 h-5 mr-2" />
              Installer
            </span>
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400 group-hover:w-full transition-all duration-500" />
          </>
        )}
      </button>
    )

  const isUpdateButton = installedVersions[gameId] !== null && needsUpdate[gameId]

  if (isUpdateButton)
    return (
      <button
        className="cursor-pointer max-w-sm w-full py-3 px-6  text-white font-mono uppercase tracking-wider rounded-lg relative overflow-hidden group transition-all duration-300 disabled:opacity-50"
        onClick={handleClick}
        disabled={!['idle', 'ready'].includes(state)}
      >
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
            'opacity-80 group-hover:opacity-80',
            'blur transition-opacity duration-500'
          )}
        />
        {state === 'downloading' && gameIdStore === gameId && (
          <span className="z-20 font-medium text-from-left-animation">
            <Loader className="inline-block w-5 h-5 mr-2" />
            Téléchargement de la MàJ ({progress}%)
          </span>
        )}
        {state === 'unzipping' && gameIdStore === gameId && (
          <span className="z-20 font-medium text-from-left-animation">
            <Loader className="inline-block w-5 h-5 mr-2" />
            Décompression de la MàJ
          </span>
        )}
        {state === 'idle' && (
          <span className="z-20 font-medium text-from-left-animation">
            <CloudDownloadIcon className="inline-block w-5 h-5 mr-2" />
            Mettre à jour
          </span>
        )}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400 group-hover:w-full transition-all duration-500" />
      </button>
    )

  const isJreButton = state === 'downloading_jre' && gameIdStore === gameId
  if (isJreButton)
    return (
      <button
        className="max-w-sm w-full py-3 px-6  text-white font-mono uppercase tracking-wider rounded-lg relative overflow-hidden group transition-all duration-300 disabled:opacity-50"
        onClick={handleClick}
        disabled={!['idle', 'ready'].includes(state)}
      >
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
            'opacity-80 group-hover:opacity-80',
            'blur transition-opacity duration-500'
          )}
        />
        <span className="z-20 font-medium text-from-left-animation">
          <Loader className="inline-block w-5 h-5 mr-2" />
          Téléchargement du JRE ({progress}%)
        </span>
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400 group-hover:w-full transition-all duration-500" />
      </button>
    )

  const isPlayButton =
    installedVersions[gameId] !== null && !needsUpdate[gameId] && state !== 'ingame'

  if (isPlayButton)
    return (
      <button
        className="cursor-pointer max-w-sm w-full py-3 px-6  text-white font-mono uppercase tracking-wider rounded-lg relative overflow-hidden group transition-all duration-300 disabled:opacity-50"
        onClick={handleClick}
        disabled={!['idle', 'ready'].includes(state)}
      >
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
            'opacity-80 group-hover:opacity-80',
            'blur transition-opacity duration-500'
          )}
        />
        {state === 'idle' && (
          <span className="z-20 font-medium text-from-left-animation">
            <GamepadIcon className="inline-block w-5 h-5 mr-2" />
            Jouer
          </span>
        )}
        {state === 'refreshing' && (
          <span className="z-20 font-medium text-from-left-animation">
            <Loader className="inline-block w-5 h-5 mr-2" />
            Authentification...
          </span>
        )}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400 group-hover:w-full transition-all duration-500" />
      </button>
    )

  const isInGameButton =
    installedVersions[gameId] !== null &&
    !needsUpdate[gameId] &&
    state === 'ingame' &&
    gameIdStore === gameId

  if (isInGameButton)
    return (
      <button
        className="max-w-sm w-full py-3 px-6  text-white font-mono uppercase tracking-wider rounded-lg relative overflow-hidden group transition-all duration-300 disabled:opacity-50"
        onClick={handleClick}
        disabled={!['idle', 'ready'].includes(state)}
      >
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
            'opacity-80 group-hover:opacity-80',
            'blur transition-opacity duration-500'
          )}
        />
        <span className="z-20 font-medium text-from-left-animation">
          <GamepadIcon className="inline-block w-5 h-5 mr-2" />
          En cours d&apos;exécution
        </span>
        <div className="absolute opacity-100 bottom-0 left-0 h-1 bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400 transition-all duration-200 w-full" />
      </button>
    )

  return (
    <button className="max-w-sm w-full py-3 px-6  text-white font-mono uppercase tracking-wider rounded-lg relative overflow-hidden group transition-all duration-300 disabled:opacity-50">
      <div
        className={cn(
          'absolute inset-0',
          'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
          'opacity-80 group-hover:opacity-80',
          'blur transition-opacity duration-500'
        )}
      />
      <span className="z-20 font-medium text-from-left-animation">Indisponible</span>
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-l from-indigo-400 via-purple-400 to-pink-400 group-hover:w-full transition-all duration-500" />
    </button>
  )
}

GameButton.propTypes = {
  gameId: PropTypes.string.isRequired
}
