import { join, resolve } from 'path'
import { getGameDir, getJavaDir } from './path'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { getAuthData } from './auth'
import { spawn } from 'child_process'
import { games } from './games'

function parseCommandLine(str, gameId) {
  const gameMeta = games[gameId]
  if (!gameMeta) throw new Error('Game not found')
  const authData = getAuthData()
  return str
    .replaceAll('{java}', resolve(getJavaDir(gameMeta.id), 'javaw.exe'))
    .replaceAll('{xmx}', '-Xmx8G')
    .replaceAll('{path}', getGameDir(gameMeta.id, true))
    .replaceAll('{uuid}', authData.id)
    .replaceAll('{token}', authData.mcToken)
    .replaceAll('{username}', authData.name)
}

export const bootstrapGame = (gameId) => {
  const gameMeta = games[gameId]

  if (!gameMeta) throw new Error('Game not found')

  const commandLineFilename = join(getGameDir(gameMeta.id, true), 'start.bat')
  const commandLine = readFileSync(commandLineFilename).toString()
  const parsedCommandLine = parseCommandLine(commandLine, gameId)

  const executableFilename = join(getGameDir(gameMeta.id, true), 'exec.bat')
  if (existsSync(executableFilename)) rmSync(executableFilename)
  writeFileSync(executableFilename, parsedCommandLine)

  const execBatPath = join(getGameDir(gameMeta.id, true), 'exec.bat')

  const child = spawn('cmd.exe', ['/c', execBatPath], {
    cwd: getGameDir(gameMeta.id, true),
    shell: false
  })

  return child
}
