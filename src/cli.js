import { select, input } from '@inquirer/prompts'

import curr from '../currency/currency.json' with { type: 'json' }
import names from '../currency/names.json' with { type: 'json' }

const cli = async () => {
  console.log('Welcome to Currency Convertor CLI')

  const currencyList = []
  for (const [curCode, curName] of Object.entries(names)) {
    currencyList.push({ name: curName, value: curCode })
  }

  console.log('')

  const currencyIn = await select({
    message: 'Please select the |IN| currency you want to convert from',
    choices: currencyList,
  })

  console.log(`Selected: ${currencyIn}`)

  console.log('')

  const currencyOut = await select({
    message: 'Now please select the |OUT| currency you want to convert into',
    choices: currencyList,
  })

  console.log(`Selected: ${currencyOut}`)

  if (currencyIn == currencyOut) {
    console.log('Error!! You cannot convert the same currency')
    console.log('Please restart the program.')
    return null
  }

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
