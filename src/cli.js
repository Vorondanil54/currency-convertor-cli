import { select, input, confirm } from '@inquirer/prompts'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import curSync from '../src/curSync.js'

import names from '../currency/names.json' with { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cli = async () => {
  console.log('Welcome to Currency Convertor CLI\n')

  const currencyList = []
  for (const [curCode, curName] of Object.entries(names)) {
    currencyList.push({ name: curName, value: curCode })
  }

  const curSyncConfirmCheck = await confirm({ message: 'Do you want to sync currency rates? (Otherwise will use local)', default: false })
  if (curSyncConfirmCheck == true) {
    await curSync()
  }
  const currPath = path.join(__dirname, '../currency/currency.json')
  const curr = JSON.parse(await fs.readFile(currPath, 'utf-8')) // import curr from '../currency/currency.json' with { type: 'json' }; using 'fs' file read command with JSON parse following to prevent using old cache if syncing rates

  console.log('')

  const currencyIn = await select({
    message: 'Please select the |IN| currency you want to convert from',
    choices: currencyList,
  })

  console.log(`Selected: ${currencyIn}\n`)

  const currencyListUpdated = currencyList.filter(cur => cur.value !== currencyIn)

  const currencyOut = await select({
    message: 'Now please select the |OUT| currency you want to convert into',
    choices: currencyListUpdated,
  })

  console.log(`Selected: ${currencyOut}\n`)

  console.log(`You have selected to convert ${names[currencyIn]} into ${names[currencyOut]} (${currencyIn} -> ${currencyOut})\n`)

  const currencyAmount = await input({ message: `Now please enter how much ${names[currencyIn]} you want to convert into ${names[currencyOut]} (${currencyIn} -> ${currencyOut})` })
  const currencyAmountFormatted = currencyAmount.replace(/\D/g, '')
  console.log(`Converting ${currencyAmountFormatted} ${currencyIn} into ${currencyOut}...`)

  const currencyFinal = currencyAmountFormatted * curr[currencyIn][currencyOut]
  console.log(`${Number(currencyFinal.toFixed(4))} ${currencyOut}`)
  return Number(currencyFinal.toFixed(4))
}

export default cli
