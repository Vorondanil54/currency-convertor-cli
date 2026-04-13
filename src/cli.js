import { select, input } from '@inquirer/prompts'

import curr from '../currency/currency.json' with { type: 'json' }

const cli = async () => {
  console.log('Welcome to Currency Convertor CLI')

  console.log('')

  const currencyIn = await select({
    message: 'Please select the |IN| currency you want to convert from',
    choices: [
      { name: 'Russian Ruble (₽)', value: 'RUB' },
      { name: 'USA Dollar ($)', value: 'USD' },
      { name: 'Kazakhstani Tenge (₸)', value: 'KZT' },
    ],
  })

  console.log(`Selected: ${currencyIn}`)

  console.log('')

  const currencyOut = await select({
    message: 'Now please select the |OUT| currency you want to convert into',
    choices: [
      { name: 'Russian Ruble (₽)', value: 'RUB' },
      { name: 'USA Dollar ($)', value: 'USD' },
      { name: 'Kazakhstani Tenge (₸)', value: 'KZT' },
    ],
  })

  console.log(`Selected: ${currencyOut}`)

  if (currencyIn == currencyOut) {
    console.log('Error!! You cannot convert the same currency')
    console.log('Please restart the program.')
    return null
  }

  console.log('')

  console.log(`You have selected to convert ${currencyIn} into ${currencyOut}`)
  const currencyAmount = await input({ message: `Now please enter how much ${currencyIn} you want to convert into ${currencyOut}` })
}

export default cli
