import { useEffect, useState } from 'react'
import icon from '../assets/icon.png'
import { useNavigate } from 'react-router-dom'

function Auth() {
  const navigate = useNavigate()

  const [version, setVersion] = useState('?')

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
  }, [setVersion, navigate])

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-8 pt-12">
      <div className="absolute h-screen w-screen left-0 top-0 z-10 bg-neutral-950"></div>
      <img src={icon} alt="Kepler Icon" className="w-20 h-20 z-20" />
      <div className="flex flex-col items-center space-y-2 z-20">
        <a
          href="http://localhost:3000/service/launcher"
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
