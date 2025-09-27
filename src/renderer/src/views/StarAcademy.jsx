import AppSidebar from '../components/app-sidebar'
import { GameButton } from '../components/game-button'
import Header from '../components/header'
import { CloudAlertIcon, RocketIcon, SettingsIcon } from 'lucide-react'
import darkrai from '../assets/cobblemon.png'
import { TextGenerateEffect } from '../components/ui/text-generate-effect'
import { ColourfulText } from '../components/ui/colorful-text'
import { useState, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip'

function StarAcademy() {
  const [serverData, setServerData] = useState({})

  useEffect(() => {
    const check = () => {
      fetch('https://api.mcstatus.io/v2/status/java/star-academy.kepler-studio.com').then((res) => res.json()).then((data) => {
        setServerData(data)
      })
    }
    const interval = setInterval(check, 30 * 1000)
    check()
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full flex flex-row">
      <AppSidebar />
      <div
        className={`bg-[url('/src/assets/bg5.jpg')] bg-center bg-cover backdrop-blur-3xl w-full h-full`}
      >
        <div className="backdrop-blur-xl h-full w-full bg-black/75 p-8 pt-10">
          <div className="w-full h-full px-14 py-2 flex flex-col items-start justify-between relative">
            <Header />
            <div className="space-y-4">
              <h1 className="text-5xl uppercase font-bold">
                Cobblemon: <ColourfulText text="Star Academy" /> New Era
              </h1>
              <TextGenerateEffect
                className="w-1/2 text-sm text-neutral-400"
                words={
                  'La saison 2 de Cobblemon ouvre ses portes avec de nouveaux défis et opportunités. Capture, entraîne et affronte d’autres dresseurs dans un monde en constante évolution. Prépare-toi à repousser tes limites et à laisser ta marque sur l’académie.'
                }
              />
              <div className="flex items-center gap-2">
                <GameButton gameId="staracademy" />
                <button
                  className="p-2.5 px-1.5 rounded-lg bg-white/30 text-transparent font-semibold flex items-center gap-2 cursor-not-allowed"
                  onClick={() => {}}
                >
                  . <SettingsIcon className="w-4 h-4 text-gray-400" strokeWidth={2} /> .
                </button>
              </div>
              {serverData.players && <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex h-8 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-3 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-sm">
                      <RocketIcon className="w-4 h-4 mr-1" strokeWidth={2} /> {serverData.players.online}{' '}
                      personne
                      {serverData.players.online === 1 ? '' : 's'} en jeu{' '}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {serverData.players.online > 0 ? (
                      <div className="animate-shimmer bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] p-2 rounded-lg border border-slate-800 text-white space-y-1">
                        {serverData.players.list.map((player) => (
                          <p key={player.uuid}>{player.name_raw}</p>
                        ))}
                      </div>
                    ) : null}
                  </TooltipContent>
                </Tooltip>
                <span className="inline-flex h-8 animate-shimmer items-center justify-center rounded-md border border-yellow-800 bg-[linear-gradient(110deg,#ff3b3b,45%,#f78239,55%,#ff3b3b)] bg-[length:200%_100%] px-3 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-sm">
                  <CloudAlertIcon className="w-4 h-4 mr-1" strokeWidth={3} /> Stats indisponibles
                </span>
              </div>}
            </div>
            <div></div>
            <img
              src={darkrai}
              alt=""
              className="absolute right-0 -bottom-20 w-[550px] rotate-[20deg]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StarAcademy
