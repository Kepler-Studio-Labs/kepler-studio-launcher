import dgram from 'node:dgram'

export function getMinecraftServerInfos(ip, port = 25565) {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket('udp4')
    const sessionID = Buffer.from([0x01, 0x02, 0x03, 0x04])
    let stage = 'handshake'
    let finished = false

    // Timeout pour éviter blocage
    const timeout = setTimeout(() => {
      if (!finished) {
        finished = true
        socket.close()
        reject(new Error('Timeout : le serveur ne répond pas'))
      }
    }, 5000)

    function safeClose() {
      if (!finished) {
        finished = true
        clearTimeout(timeout)
        socket.close()
      }
    }

    socket.on('message', (msg) => {
      try {
        if (stage === 'handshake') {
          const tokenStr = msg
            .slice(5, msg.length - 1)
            .toString('ascii')
            .trim()
          const token = parseInt(tokenStr, 10)

          const statRequest = Buffer.alloc(11 + 4)
          statRequest[0] = 0xfe
          statRequest[1] = 0xfd
          statRequest[2] = 0x00
          sessionID.copy(statRequest, 3)
          statRequest.writeUInt32BE(token, 7)
          statRequest.writeUInt32BE(0, 11)

          socket.send(statRequest, port, ip)
          stage = 'stat'
        } else if (stage === 'stat') {
          const data = msg.slice(5)
          const str = data.toString('utf8').replace(/\x00/g, '\n')
          const lines = str.split('\n').filter(Boolean)

          const result = {}
          const players = []
          let parsingPlayers = false

          for (const line of lines) {
            if (line === 'player_') {
              parsingPlayers = true
              continue
            }
            if (parsingPlayers) {
              players.push(line)
            } else {
              const idx = lines.indexOf(line)
              if (idx % 2 === 0 && lines[idx + 1]) {
                result[line] = lines[idx + 1]
              }
            }
          }

          result.players = players
          safeClose()
          resolve(result)
        }
      } catch (err) {
        safeClose()
        reject(err)
      }
    })

    socket.on('error', (err) => {
      safeClose()
      reject(err)
    })

    const handshake = Buffer.concat([Buffer.from([0xfe, 0xfd, 0x09]), sessionID])

    socket.send(handshake, port, ip, (err) => {
      if (err) {
        safeClose()
        return reject(err)
      }
    })
  })
}
