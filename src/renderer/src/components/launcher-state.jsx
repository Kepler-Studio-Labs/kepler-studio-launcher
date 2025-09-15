import { CloudDownloadIcon, FingerprintIcon } from 'lucide-react'
import { useLauncherStore } from '../store/useLauncherStore'
import { useEffect } from 'react'
import { Loader } from './loader'
import { FileArchiveIcon } from 'lucide-react'
import { GamepadIcon } from 'lucide-react'

export function LauncherState() {
  const { state, progress, fileName, installedVersion, fetchVersions } = useLauncherStore()

  useEffect(() => {
    fetchVersions()
  }, [fetchVersions])

  return ['ready', 'idle'].includes(state) ? (
    ''
  ) : (
    <div className="bg-black/50 rounded-full p-2 px-5 flex items-center gap-4">
      {state === 'ingame' && <GamepadIcon />}
      {state === 'downloading' && <CloudDownloadIcon />}
      {state === 'unzip' && <FileArchiveIcon />}
      {state === 'refreshing' && <FingerprintIcon />}
      <div className="flex flex-col items-center">
        <p className="text-sm capitalize font-semibold">
          {{
            idle: 'idle',
            refreshing: 'Authentification',
            ready: 'ready',
            downloading: 'Téléchargement',
            downloading_jre: 'Téléchargement de Java',
            unzip: 'Extraction',
            ingame: 'En jeu'
          }[state] || '?'}
        </p>
        {fileName && (
          <span className="text-xs text-neutral-400">
            {fileName}
            {installedVersion}
          </span>
        )}
      </div>
      {state === 'downloading' ||
        (state === 'downloading_jre' && (
          <div className="relative size-8">
            <svg
              className="size-full -rotate-90"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-current text-gray-200 dark:text-neutral-700"
                strokeWidth="2"
              ></circle>
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-current text-violet-600 dark:text-violet-500"
                strokeWidth="2"
                strokeDasharray="100"
                strokeDashoffset={`${100 - progress}`}
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute top-3.5 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <span className="text-center text-xs font-bold text-violet-600 dark:text-violet-500">
                {progress}
              </span>
            </div>
          </div>
        ))}
      {state === 'unzip' && <Loader />}
    </div>
  )
}
