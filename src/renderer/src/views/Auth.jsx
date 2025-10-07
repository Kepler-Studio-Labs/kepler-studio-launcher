import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthLink, getHandshakeURL } from '../../../lib/api'
import { LoaderOne } from '../components/ui/loader-one'
import { FrownIcon, Loader, RotateCcwIcon } from 'lucide-react'
import { ExternalLinkIcon } from 'lucide-react'
import { cn } from '../renderer-libs/utils'
import { KeplerLogo } from '../components/pages/auth/kepler-logo'
import BackgroundEffects from '../components/pages/auth/background-effects'
import { Badge } from '../components/ui/badge'
import { AuthLoader } from '../components/pages/auth/auth-loader'
import WaveText from '../components/pages/auth/wave-text'

function getGlowButtonClasses(additionalClasses) {
  const baseClasses =
    'inline-flex items-center space-x-2 pl-6 pr-4 py-4 rounded-full border font-sans text-base leading-4 group'
  const glowClasses =
    "relative bg-transparent text-white rounded-full border border-[#b92bfb] transition-all duration-300 before:absolute before:content-[''] before:w-[80%] before:h-[20px] before:left-[10%] before:bottom-[0px] before:bg-[#b92bfb] before:blur-[10px] before:opacity-20 after:absolute after:content-[''] after:w-[90%] after:h-[30px] after:left-[5%] after:bottom-[-6px] after:bg-[#1663F3] after:blur-[15px] after:opacity-10 hover:before:opacity-30 hover:after:opacity-20 hover:shadow-[0_2px_12px_rgba(22,99,243,0.3)]"
  return cn(baseClasses, glowClasses, additionalClasses)
}

function Auth() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [authlink, setAuthlink] = useState(null)
  const [version, setVersion] = useState('?')
  const [step, setStep] = useState(0)
  const [signInStep, setSignInStep] = useState(0)

  const isLoading = step <= 5
  const isUp = step === 6
  const isError = step >= 7

  const setStepWithDelay = (newStep) => {
    setTimeout(() => {
      setStep(newStep)
    }, 700)
  }

  const doHandshake = async () => {
    const successCb = () => {
      setStepWithDelay(1)
    }

    const errorCb = () => {
      setStep(5)
      setTimeout(() => {
        setStep(0)
      }, 2500)
    }

    const handshake = await fetch(getHandshakeURL())

    if (!handshake.ok) return errorCb()

    const json = await handshake.json().catch(() => errorCb())

    if (json.success) {
      return successCb()
    }

    return errorCb()
  }

  useEffect(() => {
    if (step === 0) {
      doHandshake()
    }

    if (step === 1) {
      window.api.getAuthData().then((authData) => {
        setUser(authData)
        setStepWithDelay(2)
      })
    }

    if (step === 2) {
      setStepWithDelay(3)
    }

    if (step === 3) {
      window.api.getAppVersion().then((ver) => {
        setVersion(ver)
        setStepWithDelay(4)
      })
    }

    if (step === 4) {
      // animation ...
      setTimeout(() => {
        setStep(5)
      }, 2600)
    }

    if (step === 5) {
      if (user !== null) {
        navigate('/main')
      } else {
        setStep(6)
      }
    }

    window.api.onAuthenticationComplete(() => {
      window.api.getAuthData().then((authData) => {
        if (authData !== null) {
          navigate('/main')
        }
      })
    })

    // doHandshake()
  }, [step])

  const handleSignInClick = () => {
    if (signInStep === 0) {
      setSignInStep(1)

      setTimeout(() => {
        setSignInStep(2)
      }, 10)
    }

    if (signInStep === 2) {
      setSignInStep(0)
    }
  }

  // It's returning a loading string cause server status are loading
  if (isLoading)
    return (
      <div className="min-h-screen bg-neutral-900 relative overflow-hidden font-sans">
        <div className="w-full h-full flex items-center justify-center">
          <AuthLoader
            loadingStates={[
              { text: 'Verification des services Kepler' },
              { text: "Recuperation des informations d'authentification" },
              { text: 'Verification des permissions' },
              { text: 'Activation du nexus pluri-dimensionnel' }
            ]}
            loading={true}
            currentState={step - 1}
          />
        </div>
      </div>
    )

  // It is returning the authentication screen cause services are up
  if (isUp)
    return (
      <div className="min-h-screen bg-neutral-900 relative overflow-hidden font-sans">
        {/* Background Effects - WebGL Light Rays (背景として配置) */}
        <div className="absolute inset-0 z-0">
          <BackgroundEffects />
        </div>

        {/* Content - 光の上に重ねて配置 */}
        <div className="relative z-50 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-8 max-w-5xl mx-auto px-8 py-20">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="bg-neutral-800/60 text-neutral-200 border-neutral-600/50 backdrop-blur-sm px-4 py-2 text-sm font-medium font-sans relative z-50"
            >
              V{version}
            </Badge>

            {/* Giselle Logo */}
            <div className="space-y-6 relative z-50">
              <KeplerLogo />

              {/* New tagline under the logo */}
              <div className="space-y-2">
                <h2
                  className="text-3xl md:text-4xl font-extralight text-white leading-tight font-sans relative z-50"
                  style={{
                    textShadow:
                      '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Jouer, s'amuser, recommencer.
                </h2>
              </div>
            </div>

            {/* New description */}
            <div className="space-y-4 max-w-3xl mx-auto relative z-50">
              <p className="text-xl text-slate-300 leading-relaxed drop-shadow-lg font-sans">
                Une bibliothèque de jeux unique inclus dans une application pensée par des joueurs
                pour des joueurs.
              </p>
            </div>

            {/* CTA Button - Single Glow Button */}
            <div className="flex justify-center pt-8 relative z-50">
              {signInStep === 0 && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  className={getGlowButtonClasses('cursor-pointer')}
                  href={getAuthLink()}
                  onClick={handleSignInClick}
                >
                  <span>Se connecter</span>
                  <span className="text-lg">→</span>
                </a>
              )}

              {signInStep >= 1 && (
                <div className="flex flex-col items-center justify-center gap-8">
                  <LoaderOne />
                  {signInStep == 2 && (
                    <a
                      className={
                        'flex items-center gap-2 rounded-lg cursor-pointer hover:text-violet-400 transition-all'
                      }
                      onClick={handleSignInClick}
                    >
                      <span>
                        <WaveText text="Un soucis ? Recommencer" />
                      </span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )

  // It's returning an error message because authentication services are down or there is a problem
  if (isError)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 pt-12">
        <div className="bg-neutral-700 p-4 border-t-2 border-t-red-400 flex items-start gap-4">
          <FrownIcon className="w-6 h-6 text-red-400" />
          <div className="flex flex-col gap-1 max-w-xl">
            <h2 className="text-xl font-bold">Oups...</h2>
            <p className="text-sm text-neutral-300 font-semibold">
              Notre service d&apos;authentification est actuellent indisponible. Merci de renouveler
              votre visite plus tard. <br />
              Pour obtenir des informations complémentaires, il pourrait être judicieux de rejoindre{' '}
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
      </div>
    )

  return "Vous ressentez l'appel du vide."
}

export default Auth
