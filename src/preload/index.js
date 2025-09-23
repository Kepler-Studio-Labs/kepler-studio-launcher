import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  onDeepLink: (callback) => {
    ipcRenderer.on('deep-link', (_, url) => callback(url))
  },
  onAuthenticationComplete: (callback) => {
    ipcRenderer.on('authentication-complete', () => callback())
  },
  onUpdateAvailable: (callback) => {
    ipcRenderer.on('update-available', () => callback())
  },
  onUpdateProgress: (callback) => {
    ipcRenderer.on('update-progress', (_, progress) => callback(progress))
  },
  onUpdateReady: (callback) => {
    ipcRenderer.on('update-ready', () => callback())
  },
  getAuthData: async () => {
    return await ipcRenderer.invoke('get-auth-data')
  },
  getAppVersion: async () => {
    return await ipcRenderer.invoke('get-app-version')
  },
  getInstalledVersion: (gameId) => ipcRenderer.invoke('get-installed-version', gameId),
  getLatestVersion: (gameId) => ipcRenderer.invoke('get-latest-version', gameId),
  getGameMeta: (gameId) => ipcRenderer.invoke('get-game-meta', gameId),
  getApiHost: () => ipcRenderer.invoke('get-api-host'),
  getMinecraftServerInfos: (ip, port) => ipcRenderer.invoke('get-minecraft-server-infos', ip, port),
  saveDownloadedFile: (data) => ipcRenderer.invoke('save-downloaded-file', data),
  unzipDownloadedFiles: (gameId) => ipcRenderer.invoke('unzip-downloaded-files', gameId),
  unzipDownloadedFiles_jre: (platform, arch) =>
    ipcRenderer.invoke('unzip-downloaded-jre-files', platform, arch),
  clearTemporaryFiles: () => ipcRenderer.invoke('clear-temporary-files'),
  saveVersionFile: (gameId, version) => ipcRenderer.invoke('save-version-file', gameId, version),
  refreshMcToken: () => ipcRenderer.invoke('refresh-mc-token'),
  bootstrap: (gameId) => ipcRenderer.invoke('bootstrap', gameId),
  onGameClosed: (callback) => {
    ipcRenderer.on('game-closed', (event, code) => callback(code))
  },
  onGameStartProgress: (callback) => {
    ipcRenderer.on('game-start-progress', (event, data) => callback(data))
  },
  stopGame: () => ipcRenderer.invoke('stop-game'),
  updateDiscordRPC: (preset) => ipcRenderer.invoke('update-discord-rpc', preset),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  checkJRE: () => ipcRenderer.invoke('check-jre')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
