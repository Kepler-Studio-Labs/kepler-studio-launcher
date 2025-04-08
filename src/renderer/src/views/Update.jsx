import { useEffect, useState } from 'react'
import keplerIcon from '../assets/icon.png'
import { ExternalLinkIcon } from 'lucide-react'

export function Update() {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    window.api.onUpdateProgress((progress) => {
      setProgress(progress)
    })
    window.api.onUpdateReady(() => {
      setReady(true)
    })
  }, [])

  const handleInstall = () => {
    window.api.installUpdate()
  }

  return (
    <div className="w-full h-full flex flex-row">
      <div
        className={`bg-[url('/src/assets/bg6.jpg')] bg-center bg-cover backdrop-blur-3xl w-full h-full`}
      >
        <div className="backdrop-blur-xl h-full w-full bg-black/75 p-8 pt-10">
          <div className="w-full h-full px-14 py-2 flex  items-center justify-center ">
            <div className="space-y-8">
              <div className="w-full">
                <img src={keplerIcon} alt="Kepler icon" className="w-16" />
              </div>
              <div className="space-y-2 p-8 bg-black/25">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold">
                    {ready ? 'Mise à jour terminée' : 'Mise à jour en cours'}
                  </h1>
                  <a
                    className="font-medium underline flex items-center gap-2 cursor-pointer"
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Notes de patch <ExternalLinkIcon className="w-4 h-4" strokeWidth={3} />
                  </a>
                </div>
                <p className="text-neutral-500 mb-3">
                  {ready
                    ? "Cliquez sur le bouton ci-dessous afin de procéder à l'installation."
                    : 'Le Launcher télécharge la dernière mise à jour afin de vous offrir les dernières fonctionnalités.'}
                </p>
                {!ready && (
                  <div className="w-full bg-white/15 rounded-full h-2.5 mb-4">
                    <div
                      className={`bg-violet-600 h-2.5 rounded-full dark:bg-white`}
                      style={{
                        width: `${progress}%`
                      }}
                    ></div>
                  </div>
                )}
                {ready && (
                  <button
                    className="p-4 rounded-lg font-semibold text-black bg-white hover:bg-neutral-200"
                    onClick={handleInstall}
                  >
                    Redémarrer et installer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
