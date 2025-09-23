import { app } from 'electron'
import { getApiHost } from './api'
import { games } from './games'
import unzipper from 'unzipper'
import semver from 'semver'
import fs from 'fs-extra'
import path from 'path'
import { getJavaDir } from './path'
import { getArch, getPlatform } from './platform'
import { promisify } from 'util'
import { execFile } from 'child_process'

/**
 * Récupère la version installée depuis le fichier adapté au gameId.
 * @param {string} game
 * @returns {string|null} la version installée, null si une erreur est survenue OU si le jeu n'est pas installé
 */
export const getInstalledVersion = (game) => {
  const versionFilePath = path.join(app.getPath('appData'), '.kepler', `${game}-version.txt`)

  try {
    if (!fs.existsSync(versionFilePath)) return null // Fichier non trouvé
    return fs.readFileSync(versionFilePath, 'utf-8')
  } catch (error) {
    console.error('Erreur lors de la lecture de la version installée :', error)
    return null
  }
}

/**
 * Récupère la dernière version du jeu depuis l'API du launcher
 * @param {string} game
 * @returns {string|null} la version la plus récente, null si une erreur est survenue
 */
export const getLatestVersion = async (game) => {
  try {
    const gameMeta = games[game]
    if (!gameMeta) return null

    const res = await fetch(`${getApiHost()}/update/game/${gameMeta.dbId}/version`)

    if (!res.ok) {
      const text = await res.text()
      console.error(text)
      throw new Error('Failed to fetch remote version')
    }

    const data = await res.json()
    return data.success ? data.version : null
  } catch {
    return null
  }
}

/**
 * Sauvegarde la version installée dans le fichier adapté au gameId.
z * @param {string} game
 * @param {string} version
 * @returns {boolean} true si la sauvegarde a réussi, false sinon
 */
export const saveVersionFile = (game, version) => {
  const versionFilePath = path.join(app.getPath('appData'), '.kepler', `${game}-version.txt`)
  try {
    if (fs.existsSync(versionFilePath)) fs.rmSync(versionFilePath)
    fs.writeFileSync(versionFilePath, version)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * Lit le fichier .update.json depuis une archive ZIP sans l'extraire.
 * @param {string} zipPath - Le chemin vers le fichier .zip.
 * @returns {Promise<object|null>} La configuration parsée ou null si non trouvée.
 */
async function readUpdateConfig(zipPath) {
  try {
    const stream = fs.createReadStream(zipPath).pipe(unzipper.Parse({ forceStream: true }))
    for await (const entry of stream) {
      if (entry.path === '.update.json') {
        const content = await entry.buffer()
        return JSON.parse(content.toString())
      } else {
        entry.autodrain() // Important pour ne pas bloquer le flux
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la lecture de .update.json dans ${zipPath}:`, error)
    return null
  }
  return null // Pas de .update.json trouvé
}

/**
 * Exécute une liste d'actions définies dans la configuration.
 * @param {Array<object>} actions - Le tableau d'actions à exécuter.
 * @param {string} baseDir - Le répertoire de base pour les opérations (sécurité).
 */
async function executeActions(actions, baseDir) {
  for (const action of actions) {
    console.log(`  -> Exécution de l'action : ${action.type}`)
    switch (action.type) {
      case 'eraseDirs':
        for (const dirPath of action.paths) {
          const fullPath = path.join(baseDir, dirPath)
          // Sécurité : Vérifier que le chemin est bien dans le répertoire de base
          if (fullPath.startsWith(baseDir)) {
            console.log(`     Suppression du dossier : ${fullPath}`)
            await fs.remove(fullPath) // fs-extra's remove gère les dossiers non vides
          }
        }
        break

      case 'eraseFiles':
        for (const filePath of action.paths) {
          const fullPath = path.join(baseDir, filePath)
          if (fullPath.startsWith(baseDir)) {
            console.log(`     Suppression du fichier : ${fullPath}`)
            await fs.remove(fullPath)
          }
        }
        break

      case 'editOptionsTxtKey': {
        const optionsFilePath = path.join(baseDir, 'options.txt')
        const { key, value } = action

        if (!key || value === undefined) {
          console.warn("     Action 'editOptionsTxtKey' ignorée : clé ou valeur manquante.")
          continue // Passe à l'action suivante
        }

        let keyExists = false
        let lines = []

        if (await fs.pathExists(optionsFilePath)) {
          // Le fichier existe, on le lit
          const content = await fs.readFile(optionsFilePath, 'utf-8')
          lines = content.split(/\r?\n/) // Gère les fins de ligne Windows/Linux

          // On cherche la clé pour la mettre à jour
          lines = lines.map((line) => {
            if (line.startsWith(key + ':')) {
              keyExists = true
              return `${key}:${value}`
            }
            return line
          })
        }

        // Si la clé n'a pas été trouvée (ou si le fichier n'existait pas), on l'ajoute
        if (!keyExists) {
          lines.push(`${key}:${value}`)
        }

        // On réécrit le fichier avec les modifications
        console.log(`     Mise à jour de options.txt : '${key}' réglé sur '${value}'`)
        await fs.writeFile(optionsFilePath, lines.join('\n'))
        break
      }

      default:
        console.warn(`Action de type "${action.type}" non reconnue.`)
    }
  }
}

/**
 * Applique les mises à jour disponibles dans le dossier des téléchargements.
 * @param {string} downloadsDir - Le dossier des téléchargements.
 * @param {string} unzipDir - Le dossier de décompression.
 * @returns {Promise<boolean>} true si toutes les mises à jour ont été appliquées avec succès, false sinon.
 */
export async function applyUpdates(downloadsDir, unzipDir) {
  const files = fs.readdirSync(downloadsDir).filter((file) => file.endsWith('.zip'))

  files.sort((a, b) => {
    const versionRegex = /(\d+\.\d+\.\d+(-[\w.-]+)?)/
    const matchA = a.match(versionRegex)
    const matchB = b.match(versionRegex)
    const versionA = matchA ? matchA[1] : '0.0.0'
    const versionB = matchB ? matchB[1] : '0.0.0'
    return semver.compare(versionA, versionB)
  })

  for (const file of files) {
    const filePath = path.join(downloadsDir, file)
    console.log(`\n--- Traitement de la mise à jour : ${file} ---`)

    const versionRegex = /(\d+\.\d+\.\d+(-[\w.-]+)?)/
    const match = file.match(versionRegex)
    const version = match ? match[1] : null

    try {
      // 1. Lire la configuration depuis le ZIP
      const updateConfig = await readUpdateConfig(filePath)

      // 2. Exécuter les actions PRE-extraction
      if (updateConfig && updateConfig.preUnzipActions) {
        console.log('Exécution des actions PRE-extraction...')
        await executeActions(updateConfig.preUnzipActions, unzipDir)
      } else {
        console.log('Aucune action PRE-extraction.')
      }

      // 3. Extraire l'archive
      console.log("Extraction des fichiers de l'archive...")
      await fs
        .createReadStream(filePath)
        .pipe(unzipper.Extract({ path: unzipDir }))
        .promise()
      console.log('Extraction terminée.')

      // 4. Exécuter les actions POST-extraction
      if (updateConfig && updateConfig.postUnzipActions) {
        console.log('Exécution des actions POST-extraction...')
        await executeActions(updateConfig.postUnzipActions, unzipDir)
      } else {
        console.log('Aucune action POST-extraction.')
      }

      if (version && updateConfig) {
        const sourceJsonPath = path.join(unzipDir, '.update.json')

        // On vérifie que le fichier a bien été extrait avant de le renommer
        if (await fs.pathExists(sourceJsonPath)) {
          const destJsonPath = path.join(unzipDir, `_${version}.update.json`)
          console.log(`Archivage du fichier de configuration en tant que : ${destJsonPath}`)
          await fs.rename(sourceJsonPath, destJsonPath)
        }
      }

      console.log(`✅ Mise à jour ${file} appliquée avec succès.`)
    } catch (error) {
      console.error(
        `❌ Échec critique lors de l'application de la mise à jour ${file}. Processus arrêté.`,
        error
      )
      // Il est crucial d'arrêter le processus ici pour ne pas continuer avec un état instable.
      return false // ou break;
    }
  }

  return true
}

const execFileAsync = promisify(execFile)

export async function checkJRE() {
  const platform = getPlatform()
  const arch = getArch()

  const javaDir = getJavaDir(platform, arch)
  const javaPath = path.join(javaDir, process.platform === 'win32' ? 'java.exe' : 'java')

  try {
    // java -version usually prints to stderr
    const { stdout, stderr } = await execFileAsync(javaPath, ['-version'])
    console.log(stdout || stderr)
    return { success: true, platform, arch }
  } catch (error) {
    // The error is normal, it happens if java is not installed
    return { success: false, platform, arch, error: error.message }
  }
}

export async function applyJREUpdates(downloadsDir, unzipDir) {
  const files = fs
    .readdirSync(downloadsDir)
    .filter((file) => file.startsWith('jre') && file.endsWith('.zip'))

  for (const file of files) {
    const filePath = path.join(downloadsDir, file)
    console.log(`\n--- Traitement de la mise à jour [JRE] : ${file} ---`)

    try {
      // 3. Extraire l'archive
      console.log("Extraction des fichiers de l'archive...")
      await fs
        .createReadStream(filePath)
        .pipe(unzipper.Extract({ path: path.join(unzipDir) }))
        .promise()
      console.log('Extraction terminée.')

      console.log(`✅ Mise à jour ${file} [JRE] appliquée avec succès.`)
    } catch (error) {
      console.error(
        `❌ Échec critique lors de l'application de la mise à jour ${file} [JRE]. Processus arrêté.`,
        error
      )
      // Il est crucial d'arrêter le processus ici pour ne pas continuer avec un état instable.
      return false // ou break;
    }
  }

  return true
}
