import { create } from 'zustand'

export const useLauncherStore = create((set, get) => ({
  state: 'idle',
  gameId: null,
  progress: 0,
  fileName: null,

  installedVersions: {},
  latestVersions: {},
  needsUpdate: {},

  fetchVersions: async (gameId) => {
    try {
      const installed = await window.api.getInstalledVersion(gameId)
      const latest = await window.api.getLatestVersion(gameId)

      set((state) => ({
        installedVersions: { ...state.installedVersions, [gameId]: installed },
        latestVersions: { ...state.latestVersions, [gameId]: latest },
        needsUpdate: { ...state.needsUpdate, [gameId]: installed !== latest }
      }))
    } catch (err) {
      console.error(`Erreur fetchVersions pour ${gameId}:`, err)
    }
  },

  setLauncherState: (newState) => set({ state: newState }),
  setProgress: (progress) => set({ progress }),
  setFileName: (fileName) => set({ fileName }),
  setGameId: (gameId) => set({ gameId }),

  startDownload: async (gameId) => {
    set({ state: 'downloading', progress: 0 })
    set({ gameId })

    const gameMeta = await window.api.getGameMeta(gameId)
    if (!gameMeta) {
      set({ state: 'idle', gameId: null })
      alert('Erreur lors de la récupération des métadonnées')
      return
    }

    const apiUrl = await window.api.getApiHost()
    const versionToDownload = get().installedVersions[gameId] || '0'

    const worker = new Worker(new URL('../downloadWorker.js', import.meta.url))
    worker.postMessage({ version: versionToDownload, gameId: gameMeta.dbId, apiUrl })

    worker.onmessage = async (e) => {
      const { progress, fileName, success, error, fileData } = e.data
      set({ progress, fileName })

      if (fileData) {
        const saveResult = await window.api.saveDownloadedFile({ fileName, fileData })
        if (saveResult.success) {
          console.log(`Fichier ${fileName} sauvegardé dans ${saveResult.filePath}`)
        } else {
          console.error(`Erreur pour ${fileName}:`, saveResult.error)
        }
      }

      if (success) {
        set({ state: 'unzip', progress: 100 })
        worker.terminate()

        const unzipResult = await window.api.unzipDownloadedFiles(gameId)
        if (unzipResult.success) {
          console.log('Fichiers décompressés dans', unzipResult.unzipDir)
          await window.api.saveVersionFile(gameId, get().latestVersions[gameId])
          console.log(get().latestVersions[gameId])
          await get().fetchVersions(gameId)
          set({ state: 'ready', gameId: null })
        } else {
          console.error('Erreur lors de la décompression :', unzipResult.error)
          set({ state: 'idle', gameId: null })
        }
        await window.api.clearTemporaryFiles()
      } else if (error) {
        console.error('Erreur lors du téléchargement :', error)
        set({ state: 'idle', gameId: null })
        worker.terminate()
      }
    }
  },
  jreCheckAndDL: async () => {
    const jreCheck = await window.api.checkJRE()
    console.log(`Backend check JRE results: ${jreCheck.success}`, jreCheck)

    if (!jreCheck.success) {
      set({ state: 'downloading_jre', gameId: null })
      console.log('Started JRE Download worker')

      const apiUrl = await window.api.getApiHost()

      return new Promise((resolve) => {
        const worker = new Worker(new URL('../downloadWorker_jre.js', import.meta.url))
        worker.postMessage({ platform: jreCheck.platform, arch: jreCheck.arch, apiUrl })

        worker.onmessage = async (e) => {
          const { progress, fileName, success, error, fileData } = e.data
          set({ progress, fileName })

          if (fileData) {
            const saveResult = await window.api.saveDownloadedFile({ fileName, fileData })
            if (saveResult.success) {
              console.log(`Fichier ${fileName} (jre) sauvegardé dans ${saveResult.filePath}`)
            } else {
              console.error(`Erreur pour ${fileName} (jre):`, saveResult.error)
            }
          }

          if (success) {
            set({ state: 'unzip', progress: 100 })
            worker.terminate()

            const unzipResult = await window.api.unzipDownloadedFiles_jre(
              jreCheck.platform,
              jreCheck.arch
            )

            await window.api.clearTemporaryFiles()

            if (unzipResult.success) {
              console.log('Fichiers décompressés (jre) dans', unzipResult.unzipDir)
              resolve(true) // ✅ retour attendu
            } else {
              console.error('Erreur lors de la décompression du JRE :', unzipResult.error)
              set({ state: 'idle', gameId: null })
              resolve(false) // ❌ mais on retourne bien quelque chose
            }
          } else if (error) {
            console.error('Erreur lors du téléchargement du JRE :', error)
            set({ state: 'idle', gameId: null })
            worker.terminate()
            resolve(false)
          }
        }
      })
    } else {
      return true
    }
  },
  bootstrap: async (gameId) => {
    const jreCheck = await get().jreCheckAndDL()
    console.log(jreCheck)
    if (!jreCheck) {
      set({ state: 'idle', gameId: null })
      alert('Erreur lors de la vérification ou du téléchargement du JRE')
      return
    }

    set({ state: 'refreshing' })
    set({ gameId })
    const authSuccess = await window.api.refreshMcToken()
    if (!authSuccess) {
      set({ state: 'idle', gameId: null })
      alert("Erreur lors de l'authentification")
      return
    }

    const gameMeta = await window.api.getGameMeta(gameId)
    if (!gameMeta) {
      set({ state: 'idle', gameId: null })
      alert('Erreur lors de la récupération des métadonnées')
      return
    }

    window.api.updateDiscordRPC(`${gameMeta.dbId}_PLAYING`)
    set({ state: 'launching', gameId })
    await window.api.bootstrap(gameId)
    window.api.onGameClosed((code) => {
      console.log("Event 'game-closed' reçu avec code", code)
      window.api.updateDiscordRPC('MAIN_MENU')
      set({ state: 'idle', gameId: null })
    })
    window.api.onGameStartProgress((data) => {
      if (get().gameId === data.gameId) {
        set({ progress: data.progress })
        if (data.progress === 100) {
          set({ state: 'ingame', gameId })
        }
      }
    })
  },
  stopGame: async () => {
    await window.api.stopGame()
    set({ state: 'idle', gameId: null })
    window.api.updateDiscordRPC('MAIN_MENU')
  }
}))
