import fs from 'fs/promises'
import 'dotenv/config'

import names from '../currency/names.json' with { type: 'json' }

let apiUrl = 'https://api.fxratesapi.com/latest?' // Example: https://api.fxratesapi.com/latest?base=RUB&currencies=USD,EUR&api_key
const apiKey = process.env.API_KEY
let apiCurIn = 'base='
let apiCurOut = 'currencies='
const separator = '&'

const curSync = async () => {
  const curRatesList = {}

  for (const cur of Object.keys(names)) { // Step 1: Forming an URL for further conversion until there will be no currency codes left to check
    apiCurIn += `${cur}${separator}`
    for (const curSub of Object.keys(names)) {
      if (curSub === cur) {
        continue
      }
      apiCurOut += `${curSub},`
    }
    apiCurOut = apiCurOut.slice(0, -1)
    apiCurOut += separator
    apiUrl += `${apiCurIn}${apiCurOut}${apiKey}`
    // console.log(apiUrl)

    curRatesList[cur] = {} // Step 1.5: Create object in curRatesList variable with |IN| currency key

    async function getCurrencyRates() { // Step 2: Contacting FXRatesAPI server for currency rates
      try {
        const response = await fetch(apiUrl)
        const data = await response.json()

        for (const curSub of Object.keys(names)) {
          if (curSub === cur) {
            continue
          }
          // console.log(`${curSub} ${data.rates[curSub]}`)
          curRatesList[cur][curSub] = data.rates[curSub] // Step 2.5: Create object in curRatesList variable with |OUT| currency key
        }

        // console.log('')
      }
      catch (error) {
        console.log(`Error: ${error}`)
      }
    }
    await getCurrencyRates()

    apiUrl = 'https://api.fxratesapi.com/latest?' // Step 3: Resetting URL
    apiCurIn = 'base='
    apiCurOut = 'currencies='
  }

  // console.log(curRatesList)

  fs.writeFile('./currency/currency.json', JSON.stringify(curRatesList, null, 4)) // Step 4: Write final list of currency rates into currency.json file
}

export default curSync
