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
  getInstalledVersion: () => ipcRenderer.invoke('get-installed-version'),
  getLatestVersion: () => ipcRenderer.invoke('get-latest-version'),
  getApiHost: () => ipcRenderer.invoke('get-api-host'),
  saveDownloadedFile: (data) => ipcRenderer.invoke('save-downloaded-file', data),
  unzipDownloadedFiles: () => ipcRenderer.invoke('unzip-downloaded-files'),
  clearTemporaryFiles: () => ipcRenderer.invoke('clear-temporary-files'),
  saveVersionFile: (version) => ipcRenderer.invoke('save-version-file', version),
  refreshMcToken: () => ipcRenderer.invoke('refresh-mc-token'),
  bootstrap: () => ipcRenderer.invoke('bootstrap'),
  onGameClosed: (callback) => {
    ipcRenderer.on('game-closed', (event, code) => callback(code))
  },
  stopGame: () => ipcRenderer.invoke('stop-game'),
  updateDiscordRPC: (data) => ipcRenderer.invoke('update-discord-rpc', data),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  openGameSettingsTab: (gameId) => ipcRenderer.invoke('open-game-settings-tab', gameId)
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
