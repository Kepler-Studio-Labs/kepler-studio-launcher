import { useCallback, useEffect, useState, useTransition } from 'react'
import icon from '../assets/icon.png'
import { useNavigate } from 'react-router-dom'
import { getAuthLink, getHandshakeURL } from '../../../lib/api'
import { Loader } from '../components/loader'
import { FrownIcon } from 'lucide-react'
import { ExternalLinkIcon } from 'lucide-react'

function Auth() {
  const navigate = useNavigate()

  const [version, setVersion] = useState('?')
  const [isLoading, startTransition] = useTransition()
  const [isUp, setIsUp] = useState(false)

  const doHandshake = useCallback(() => {
    startTransition(async () => {
      const handshake = await fetch(getHandshakeURL())

      if (!handshake.ok) return setTimeout(doHandshake, 2500)

      const json = await handshake.json().catch(() => setTimeout(doHandshake, 2500))

      if (json.success) {
        setIsUp(true)
        return setTimeout(doHandshake, 15000)
      }

      return setTimeout(doHandshake, 2500)
    })
  }, [])

  useEffect(() => {
    window.api.getAppVersion().then((ver) => {
      setVersion(ver)
    })

    window.api.getAuthData().then((authData) => {
      if (authData !== null) {
        navigate('/main')
      }
    })

    window.api.onAuthenticationComplete(() => {
      window.api.getAuthData().then((authData) => {
        if (authData !== null) {
          navigate('/main')
        }
      })
    })

    doHandshake()
  }, [setVersion, navigate, doHandshake])

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 pt-12">
      <div className="absolute h-screen w-screen left-0 top-0 z-10 bg-neutral-950"></div>
      <img src={icon} alt="Kepler Icon" className="w-20 h-20 z-20" />
      <div className="flex flex-col items-center space-y-2 z-20">
        {isLoading ? (
          <Loader />
        ) : isUp ? (
          <>
            <a
              href={getAuthLink()}
              target="_blank"
              rel="noreferrer"
              className="block py-4 px-12 w-fit bg-violet-500 hover:bg-violet-700 transition-all text-white font-bold text-lg rounded"
            >
              Connexion
            </a>
            <p className="font-semibold uppercase text-neutral-500 w-full text-center">
              Pas de compte Minecraft ?{' '}
              <a
                href="https://www.minecraft.net/fr-fr"
                target="_blank"
                rel="noreferrer"
                className="text-violet-500 hover:underline"
              >
                Acheter le jeu
              </a>
            </p>
          </>
        ) : (
          <>
            <div className="bg-neutral-800 p-4 border-t-2 border-t-red-400 flex items-start gap-4">
              <FrownIcon className="w-6 h-6 text-red-400" />
              <div className="flex flex-col gap-1 max-w-xl">
                <h2 className="text-xl font-bold">Oups...</h2>
                <p className="text-sm text-neutral-300 font-semibold">
                  Notre service d&apos;authentification est actuellent indisponible. Merci de
                  renouveler votre visite plus tard. <br />
                  Pour obtenir des informations complémentaires, il pourrait être judicieux de
                  rejoindre{' '}
                  <a
                    href="https://discord.gg/5YAvA8Rdpj"
                    className="text-red-400 inline-flex items-center gap-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    notre discord <ExternalLinkIcon className="w-3 h-3" />
                  </a>
                  . Vous y trouverez des informations complémentaires.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="w-full flex items-center justify-between z-20">
        <a
          href="https://discord.gg/5YAvA8Rdpj"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-neutral-500 hover:text-white transition-all"
        >
          Problème lors de la connexion ?
        </a>
        <span className="font-bold text-neutral-700">V{version}</span>
      </div>
    </div>
  )
}

export default Auth
