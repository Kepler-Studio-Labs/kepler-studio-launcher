export function getStarAcademyWhitelist() {
  return new Promise((resolve, reject) => {
    fetch('https://legacy-launcher-api.kepler-industries.com/whitelist/STAR_ACADEMY')
      .then((response) => response.json())
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
