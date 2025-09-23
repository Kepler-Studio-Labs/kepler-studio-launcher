import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { disconnect, getAuthData, refreshMcToken, saveAuthData } from '../lib/auth'
import {
  applyJREUpdates,
  applyUpdates,
  checkJRE,
  getInstalledVersion,
  getLatestVersion,
  saveVersionFile
} from '../lib/update'
import fs from 'fs'
import { getGameDir, getJavaInstallDir, getKeplerPath } from '../lib/path'
import { bootstrapGame } from '../lib/bootstrap'
import { getApiHost } from '../lib/api'
import { autoUpdater } from 'electron-updater'
import { DiscordRPCInstance, RPC_PRESETS } from '../lib/discord'
import { games } from '../lib/games'
import { getMinecraftServerInfos } from '../lib/mc-server-query'

let gameProcess = null // Stocke la référence du processus lanc

const isDev = !app.isPackaged

//autoUpdater.setFeedURL(
//  `https://update.electronjs.org/Kepler-Studio-Labs/kepler-studio-launcher/win32-x64/${app.getVersion()}`
//)

const DiscordRPC = new DiscordRPCInstance()

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('keplerlauncher', process.execPath, [
      path.resolve(process.argv[1])
    ])
  }
} else {
  app.setAsDefaultProtocolClient('keplerlauncher')
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    resizable: false,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.webContents.on('before-input-event', (_, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') {
      mainWindow.webContents.isDevToolsOpened()
        ? mainWindow.webContents.closeDevTools()
        : mainWindow.webContents.openDevTools({ mode: 'left' })
    }
  })

  mainWindow.webContents.once('did-finish-load', () => {
    if (!isDev) {
      console.log('Checking for updates...')

      autoUpdater.checkForUpdates().then((res) => console.log(res))

      autoUpdater.on('update-available', () => {
        mainWindow.webContents.send('update-available')
      })

      autoUpdater.on('update-downloaded', () => {
        mainWindow.webContents.send('update-ready')
      })

      autoUpdater.on('error', () => {})

      autoUpdater.on('download-progress', (progress) => {
        mainWindow.webContents.send('update-progress', progress.percent)
      })
    } else {
      // uncomment to test update UI
      // win.webContents.send('update-available')
    }
  })

  return mainWindow
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  let win = createWindow()

  ipcMain.on('close', () => app.quit())
  ipcMain.on('minimize', () => win.minimize())
  ipcMain.on('disconnect', () => disconnect())
  ipcMain.handle('install-update', () => {
    autoUpdater.quitAndInstall()
  })
  ipcMain.handle('get-auth-data', async () => {
    const auth = getAuthData()
    return auth
  })
  ipcMain.handle('get-app-version', async () => {
    return app.getVersion()
  })
  ipcMain.handle('get-installed-version', (_, game) => {
    const ver = getInstalledVersion(game)
    return ver
  })
  ipcMain.handle('get-latest-version', async (_, game) => await getLatestVersion(game))
  ipcMain.handle('get-game-meta', async (_, game) => games[game])
  ipcMain.handle('get-api-host', () => getApiHost())
  ipcMain.handle(
    'get-minecraft-server-infos',
    async (_, ip, port) => await getMinecraftServerInfos(ip, port)
  )
  ipcMain.handle('save-downloaded-file', async (_, { fileName, fileData }) => {
    try {
      const downloadsDir = path.join(getKeplerPath(), 'tmp')
      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true })
      }

      const filePath = path.join(downloadsDir, fileName)
      const buffer = Buffer.from(fileData)
      fs.writeFileSync(filePath, buffer)
      return { success: true, filePath }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du fichier téléchargé :', error)
      return { success: false, error: error.message }
    }
  })
  ipcMain.handle('unzip-downloaded-files', async (_, gameId) => {
    try {
      const downloadsDir = path.join(getKeplerPath(), 'tmp')

      const unzipDir = path.join(getGameDir(gameId, true))
      if (!fs.existsSync(unzipDir)) {
        fs.mkdirSync(unzipDir, { recursive: true })
      }

      const success = await applyUpdates(downloadsDir, unzipDir)

      return { success, unzipDir }
    } catch (error) {
      console.error('Erreur lors de la décompression des fichiers :', error)
      return { success: false, error: error.message }
    }
  })
  ipcMain.handle('unzip-downloaded-jre-files', async (_, platform, arch) => {
    try {
      const downloadsDir = path.join(getKeplerPath(), 'tmp')

      const unzipDir = getJavaInstallDir(platform, arch)
      if (!fs.existsSync(unzipDir)) {
        fs.mkdirSync(unzipDir, { recursive: true })
      }

      const success = await applyJREUpdates(downloadsDir, unzipDir)

      return { success, unzipDir }
    } catch (error) {
      console.error('Erreur lors de la décompression des fichiers :', error)
      return { success: false, error: error.message }
    }
  })
  ipcMain.handle('clear-temporary-files', async () => {
    try {
      const downloadsDir = path.join(getKeplerPath(), 'tmp')
      if (fs.existsSync(downloadsDir)) fs.rmSync(downloadsDir, { recursive: true })
      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la suppression des fichiers temporaires :', error)
      return { success: false, error: error.message }
    }
  })
  ipcMain.handle('save-version-file', (_, gameId, version) => saveVersionFile(gameId, version))
  ipcMain.handle('bootstrap', async (_, gameId) => {
    // Lance le jeu seulement si ce n'est pas déjà en cours
    if (!gameProcess) {
      const startedAt = Date.now()
      if (!fs.existsSync(path.join(getKeplerPath(), 'kepler-logs', gameId)))
        fs.mkdirSync(path.join(getKeplerPath(), 'kepler-logs', gameId), {
          recursive: true
        })
      fs.writeFileSync(path.join(getKeplerPath(), 'kepler-logs', gameId, `${startedAt}.log`), '')
      gameProcess = bootstrapGame(gameId)
      gameProcess.on('close', (code) => {
        fs.unlinkSync(path.join(getKeplerPath(), 'kepler-logs', gameId, `${startedAt}.log`))
        win.webContents.send('game-closed', code)
        gameProcess = null
      })

      const startPoints = games[gameId].startPoints

      const checkLog = (data) => {
        if (startPoints.some((sp) => data.includes(sp.match))) {
          const progress = startPoints.find((sp) => data.includes(sp.match)).progress
          win.webContents.send('game-start-progress', {
            progress,
            gameId
          })
        }
      }

      gameProcess.stdout.on('data', (data) => {
        const startedSinceSeconds = Math.round((Date.now() - startedAt) / 1000)
        const msg = `(${startedSinceSeconds}s) stdout: ${data}\n`
        //console.log(msg)
        fs.appendFileSync(
          path.join(getKeplerPath(), 'kepler-logs', gameId, `${startedAt}.log`),
          msg
        )
        checkLog(data)
      })
      gameProcess.stderr.on('data', (data) => {
        const startedSinceSeconds = Math.round((Date.now() - startedAt) / 1000)
        const msg = `(${startedSinceSeconds}s) stderr: ${data}\n`
        //console.log(msg)
        fs.appendFileSync(
          path.join(getKeplerPath(), 'kepler-logs', gameId, `${startedAt}.log`),
          msg
        )
        checkLog(data)
      })
    }
    return 'Game started'
  })
  ipcMain.handle('refresh-mc-token', async () => {
    const authData = getAuthData()
    if (!authData) return false
    const res = await refreshMcToken(authData.mcToken, authData.refreshToken)
    if (res.success) {
      if (res.data) saveAuthData(res.data)
      return true
    } else {
      return false
    }
  })
  ipcMain.handle('stop-game', async () => {
    if (gameProcess && !gameProcess.killed) {
      gameProcess.kill()
      gameProcess = null
      return 'Game stopped'
    } else {
      return 'No game running'
    }
  })
  ipcMain.handle('update-discord-rpc', (_, preset) => {
    const presetData = RPC_PRESETS[preset]
    if (!presetData) return console.error('Preset not found for discord rpc:', preset)
    DiscordRPC.update(presetData)
  })
  ipcMain.handle('check-jre', async () => {
    const jreCheck = await checkJRE()
    return jreCheck
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      win = createWindow()
    }
  })

  const handleDeepLink = (url) => {
    const method = url.split('/')[url.split('/').length - 2]
    if (method === 'autolog') {
      if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
      }

      const b64 = url.split('/')[url.split('/').length - 1]
      saveAuthData(b64)

      win.webContents.send('authentication-complete')
    }
  }

  app.on('open-url', (event, url) => {
    event.preventDefault()
    handleDeepLink(url)
  })

  if (!app.requestSingleInstanceLock()) {
    app.quit()
  } else {
    app.on('second-instance', (_, commandLine) => {
      const url = commandLine[commandLine.length - 1]
      handleDeepLink(url)
    })
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
