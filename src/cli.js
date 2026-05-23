import { select, input, confirm } from '@inquirer/prompts'
import fs from 'fs/promises'

import curSync from '../src/curSync.js'

import names from '../currency/names.json' with { type: 'json' }

const cli = async () => {
  console.log('Welcome to Currency Convertor CLI')

  const currencyList = []
  for (const [curCode, curName] of Object.entries(names)) {
    currencyList.push({ name: curName, value: curCode })
  }

  console.log('')

  const curSyncConfirmCheck = await confirm({ message: 'Do you want to sync currency rates? (Otherwise will use local)', default: false })
  if (curSyncConfirmCheck == true) {
    await curSync()
  }
  const curr = JSON.parse(await fs.readFile('./currency/currency.json', 'utf-8')) // import curr from '../currency/currency.json' with { type: 'json' }; using 'fs' file read command with JSON parse following to prevent using old cache if syncing rates

  console.log('')

  const currencyIn = await select({
    message: 'Please select the |IN| currency you want to convert from',
    choices: currencyList,
  })

  console.log(`Selected: ${currencyIn}`)

  console.log('')

  const currencyListUpdated = currencyList.filter(cur => cur.value !== currencyIn)

  const currencyOut = await select({
    message: 'Now please select the |OUT| currency you want to convert into',
    choices: currencyListUpdated,
  })

  console.log(`Selected: ${currencyOut}`)

  console.log('')

  console.log(`You have selected to convert ${names[currencyIn]} into ${names[currencyOut]} (${currencyIn} -> ${currencyOut})`)

  console.log('')

  const currencyAmount = await input({ message: `Now please enter how much ${names[currencyIn]} you want to convert into ${names[currencyOut]} (${currencyIn} -> ${currencyOut})` })
  const currencyAmountFormatted = currencyAmount.replace(/\D/g, '')
  console.log(`Converting ${currencyAmountFormatted} ${currencyIn} into ${currencyOut}...`)

  const currencyFinal = currencyAmountFormatted * curr[currencyIn][currencyOut]
  console.log(`${parseFloat(currencyFinal.toFixed(10))} ${currencyOut}`)
  return parseFloat(currencyFinal.toFixed(10))
}

export default cli
