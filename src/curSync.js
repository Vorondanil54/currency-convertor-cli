import { input } from '@inquirer/prompts'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

import names from '../currency/names.json' with { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.join(__dirname, '../.env')

let apiUrl = 'https://api.fxratesapi.com/latest?' // Example: https://api.fxratesapi.com/latest?base=RUB&currencies=USD,EUR&api_key
let apiCurIn = 'base='
let apiCurOut = 'currencies='
const separator = '&'

const curSync = async () => {
  const curRatesList = {}

  if (!existsSync(envPath)) {
    await fs.writeFile(envPath, 'API_KEY=YOUR_API_KEY_HERE\n', 'utf8')
  }

  dotenv.config({
    path: path.join(__dirname, '../.env'),
    debug: false,
    quiet: true,
  })

  if (!process.env.API_KEY || process.env.API_KEY === 'YOUR_API_KEY_HERE') {
    console.log('\nAttention! FXRatesAPI key is required for synchronization')

    const userApiKey = await input({
      message: 'Please enter your API key:',
      validate: value => value.trim().length > 0 ? true : 'Key cannot be empty!',
    })

    await fs.writeFile(envPath, `API_KEY=${userApiKey.trim()}\n`, 'utf8')

    process.env.API_KEY = userApiKey.trim()
    console.log('API key saved\n')
  }

  const apiKey = process.env.API_KEY

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
        if (response.status === 401 || response.status === 403) {
          throw new Error('Invalid API key! Please check your key in the .env file.')
        }
        const data = await response.json()
        if (data.success === false) {
          throw new Error(data.error?.message || 'API Error')
        }

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
        console.log(`Error during syncing: ${error.message}`)
      }
    }
    await getCurrencyRates()

    apiUrl = 'https://api.fxratesapi.com/latest?' // Step 3: Resetting URL
    apiCurIn = 'base='
    apiCurOut = 'currencies='
  }

  // console.log(curRatesList)

  const currPath = path.join(__dirname, '../currency/currency.json')
  await fs.writeFile(currPath, JSON.stringify(curRatesList, null, 4)) // Step 4: Write final list of currency rates into currency.json file
  console.log('Rates synced successfully, resuming...')
}

export default curSync
