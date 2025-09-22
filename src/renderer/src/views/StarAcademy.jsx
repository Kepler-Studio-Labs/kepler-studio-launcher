import AppSidebar from '../components/app-sidebar'
import { GameButton } from '../components/game-button'
import Header from '../components/header'
import { SettingsIcon } from 'lucide-react'
import darkrai from '../assets/cobblemon.png'
import { TextGenerateEffect } from '../components/ui/text-generate-effect'
import { ColourfulText } from '../components/ui/colorful-text'

function StarAcademy() {
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
