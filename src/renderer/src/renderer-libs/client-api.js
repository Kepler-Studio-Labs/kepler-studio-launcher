export function getStarAcademyWhitelist() {
  return new Promise((resolve, reject) => {
    fetch('https://launcher-api.kepler-studio.com/whitelist/STAR_ACADEMY')
      .then((response) => response.json())
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
