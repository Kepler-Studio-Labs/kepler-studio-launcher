import { join, resolve } from 'path'
import { getGameDir, getJavaDir } from './path'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { getAuthData } from './auth'
import { spawn } from 'child_process'
import { games } from './games'
import { getArch, getPlatform } from './platform'

function parseCommandLine(str, gameId, platform, arch) {
  const gameMeta = games[gameId]
  if (!gameMeta) throw new Error('Game not found')
  const authData = getAuthData()
  return str
    .replaceAll(
      '{java}',
      resolve(getJavaDir(platform, arch), platform === 'windows' ? 'javaw.exe' : 'java').replace(
        /(?<!\\) /g,
        '\\ '
      )
    )
    .replaceAll('{xmx}', '-Xmx8G')
    .replaceAll('{path}', getGameDir(gameMeta.id, true).replace(/(?<!\\) /g, '\\ '))
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
