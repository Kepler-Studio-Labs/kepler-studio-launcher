// downloadWorker.js

self.onmessage = async function (e) {
  const { version, apiUrl } = e.data

  console.log(version, apiUrl)

  try {
    const response = await fetch(`${apiUrl}/update/game/${version}`)
    if (!response.ok) throw new Error('Erreur lors de la récupération de la liste de fichiers')
    const json = await response.json()
    const files = json.updates

    const totalBytes = files.reduce((acc, file) => acc + file.size, 0)
    let downloadedBytes = 0

    for (const file of files) {
      const res = await fetch(file.downloadUrl)
      if (!res.ok) throw new Error('Erreur lors du téléchargement de ' + file.name)

      const reader = res.body.getReader()
      let done = false
      const chunks = []

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        if (value) {
          chunks.push(value)
          downloadedBytes += value.byteLength
          const overallProgress = Math.round((downloadedBytes / totalBytes) * 100)
          // Mise à jour de la progression (sans fichier complet)
          self.postMessage({ progress: overallProgress, fileName: file.filename })
        }
        done = doneReading
      }

      // Concaténer les chunks téléchargés en un seul ArrayBuffer
      let fileLength = chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0)
      const fileBuffer = new Uint8Array(fileLength)
      let offset = 0
      for (const chunk of chunks) {
        fileBuffer.set(new Uint8Array(chunk.buffer), offset)
        offset += chunk.byteLength
      }

      // Envoyer le fichier complet (ArrayBuffer) pour sauvegarde
      self.postMessage({ fileName: file.filename, fileData: fileBuffer.buffer })
    }

    self.postMessage({ progress: 100, success: true })
  } catch (error) {
    self.postMessage({ progress: 0, success: false, error: error.message })
  }
}
