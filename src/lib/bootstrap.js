import { join, resolve } from 'path'
import { getGameDir, getJavaDir } from './path'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { getAuthData } from './auth'
import { spawn } from 'child_process'
import { games } from './games'
import { getArch, getPlatform } from './platform'

function escapeSpaces(str) {
  let out = ''
  let inQuotes = false
  for (let i = 0; i < str.length; i++) {
    const c = str[i]
    if (c === '"') {
      inQuotes = !inQuotes
      out += c
    } else if (c === ' ' && !inQuotes && (i === 0 || str[i - 1] !== '\\')) {
      out += '\\ '
    } else {
      out += c
    }
  }
  return out
}

function parseCommandLine(str, gameId, platform, arch) {
  const gameMeta = games[gameId]
  if (!gameMeta) throw new Error('Game not found')
  const authData = getAuthData()
  return str
    .replaceAll(
      '{java}',
      escapeSpaces(
        resolve(getJavaDir(platform, arch), platform === 'windows' ? 'javaw.exe' : 'java')
      )
    )
    .replaceAll('{xmx}', '-Xmx8G')
    .replaceAll('{path}', escapeSpaces(getGameDir(gameMeta.id, true)))
    .replaceAll('{uuid}', authData.id)
    .replaceAll('{token}', authData.mcToken)
    .replaceAll('{username}', authData.name)
}

export const bootstrapGame = (gameId) => {
  const gameMeta = games[gameId]

  if (!gameMeta) throw new Error('Game not found')

  const platform = getPlatform()
  const arch = getArch()
  const commandLineFilename = join(getGameDir(gameMeta.id, true), 'start.bat')
  const commandLine = readFileSync(commandLineFilename).toString()
  const parsedCommandLine = parseCommandLine(commandLine, gameId, platform, arch)

  const executableFilename = join(getGameDir(gameMeta.id, true), 'exec.bat')
  if (existsSync(executableFilename)) rmSync(executableFilename)
  writeFileSync(executableFilename, parsedCommandLine)

  const executableFilename_sh = join(getGameDir(gameMeta.id, true), 'exec.sh')
  if (existsSync(executableFilename_sh)) rmSync(executableFilename_sh)
  writeFileSync(executableFilename_sh, parsedCommandLine)

  const execBatPath = join(getGameDir(gameMeta.id, true), 'exec.bat')
  const execShPath = join(getGameDir(gameMeta.id, true), 'exec.sh')

  const child =
    platform === 'windows'
      ? spawn('cmd.exe', ['/c', execBatPath], {
          cwd: getGameDir(gameMeta.id, true),
          shell: false
        })
      : spawn('/bin/bash', [execShPath], {
          cwd: getGameDir(gameMeta.id, true),
          shell: false
        })

  return child
}
