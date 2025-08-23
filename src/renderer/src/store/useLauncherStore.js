import { create } from 'zustand'

export const useLauncherStore = create((set, get) => ({
  state: 'idle',
  progress: 0,
  fileName: null,
  installedVersion: null,
  latestVersion: null,
  needsUpdate: false,

  fetchVersions: async () => {
    const installed = await window.api.getInstalledVersion()
    const latest = await window.api.getLatestVersion()
    console.log('installed', installed)
    console.log('latest', latest)
    set({
      installedVersion: installed,
      latestVersion: latest,
      needsUpdate: installed !== latest
    })
  },

  setLauncherState: (newState) => set({ state: newState }),
  setProgress: (progress) => set({ progress }),
  setFileName: (fileName) => set({ fileName }),

  startDownload: async () => {
    set({ state: 'downloading', progress: 0 })

    const apiUrl = await window.api.getApiHost()
    const versionToDownload = get().installedVersion || '0'

    const worker = new Worker(new URL('../downloadWorker.js', import.meta.url))
    worker.postMessage({ version: versionToDownload, apiUrl })

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

        const unzipResult = await window.api.unzipDownloadedFiles()
        if (unzipResult.success) {
          console.log('Fichiers décompressés dans', unzipResult.unzipDir)
          await window.api.saveVersionFile(get().latestVersion)
          await get().fetchVersions()
          set({ state: 'ready' })
        } else {
          console.error('Erreur lors de la décompression :', unzipResult.error)
          set({ state: 'idle' })
        }
        await window.api.clearTemporaryFiles()
      } else if (error) {
        console.error('Erreur lors du téléchargement :', error)
        set({ state: 'idle' })
        worker.terminate()
      }
    }
  },
  bootstrap: async () => {
    set({ state: 'ingame' })
    window.api.updateDiscordRPC({
      details: 'Cobblemon: New Era',
      state: 'En jeu',
      smallImageKey: 'pokeball',
      smallImageText: 'Cobblemon: New Era',
      startTimestamp: new Date()
    })
    await window.api.bootstrap()
    window.api.onGameClosed((code) => {
      console.log("Event 'game-closed' reçu avec code", code)
      set({ state: 'ready' })
    })
  },
  stopGame: async () => {
    await window.api.stopGame()
    set({ state: 'ready' })
    window.api.updateDiscordRPC({
      details: 'Menu principal',
      state: null,
      smallImageKey: null,
      smallImageText: null,
      startTimestamp: new Date()
    })
  }
}))
