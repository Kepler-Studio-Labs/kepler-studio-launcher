import { join, resolve } from 'path'
import { getCobblemonDir, getJavaDir } from './path'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { getAuthData } from './auth'
import { spawn } from 'child_process'

function parseCommandLine(str) {
  const authData = getAuthData()
  return str
    .replaceAll('{java}', resolve(getJavaDir(), 'javaw.exe'))
    .replaceAll('{xmx}', '-Xmx8G')
    .replaceAll('{path}', getCobblemonDir())
    .replaceAll('{uuid}', authData.id)
    .replaceAll('{token}', authData.mcToken)
    .replaceAll('{username}', authData.name)
}

export const bootstrapGame = () => {
  const commandLineFilename = join(getCobblemonDir(), 'start.bat')
  const commandLine = readFileSync(commandLineFilename).toString()
  const parsedCommandLine = parseCommandLine(commandLine)

  const executableFilename = join(getCobblemonDir(), 'exec.bat')
  if (existsSync(executableFilename)) rmSync(executableFilename)
  writeFileSync(executableFilename, parsedCommandLine)

  const execBatPath = join(getCobblemonDir(), 'exec.bat')

  const child = spawn('cmd.exe', ['/c', execBatPath], {
    cwd: getCobblemonDir(),
    shell: false
  })

  return child
}
