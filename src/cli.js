import { select, input } from '@inquirer/prompts'

import curr from '../currency/currency.json' with { type: 'json' }
import names from '../currency/names.json' with { type: 'json' }

const cli = async () => {
  console.log('Welcome to Currency Convertor CLI')

  console.log('')

  const currencyIn = await select({
    message: 'Please select the |IN| currency you want to convert from',
    choices: [
      { name: 'US Dollar ($)', value: 'USD' },
      { name: 'Euro (€)', value: 'EUR' },
      { name: 'British Pound (£)', value: 'GBP' },
      { name: 'Japanese Yen (¥)', value: 'JPY' },
      { name: 'Chinese Yuan (¥)', value: 'CNY' },
      { name: 'Russian Ruble (₽)', value: 'RUB' },
      { name: 'Swiss Franc (₣)', value: 'CHF' },
      { name: 'Turkish Lira (₺)', value: 'TRY' },
      { name: 'Indian Rupee (₹)', value: 'INR' },
      { name: 'South Korean Won (₩)', value: 'KRW' },
      { name: 'Kazakhstani Tenge (₸)', value: 'KZT' },
    ],
  })

  console.log(`Selected: ${currencyIn}`)

  console.log('')

  const currencyOut = await select({
    message: 'Now please select the |OUT| currency you want to convert into',
    choices: [
      { name: 'US Dollar ($)', value: 'USD' },
      { name: 'Euro (€)', value: 'EUR' },
      { name: 'British Pound (£)', value: 'GBP' },
      { name: 'Japanese Yen (¥)', value: 'JPY' },
      { name: 'Chinese Yuan (¥)', value: 'CNY' },
      { name: 'Russian Ruble (₽)', value: 'RUB' },
      { name: 'Swiss Franc (₣)', value: 'CHF' },
      { name: 'Turkish Lira (₺)', value: 'TRY' },
      { name: 'Indian Rupee (₹)', value: 'INR' },
      { name: 'South Korean Won (₩)', value: 'KRW' },
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

  console.log(`You have selected to convert ${names[currencyIn]} into ${names[currencyOut]} (${currencyIn} -> ${currencyOut})`)

  console.log('')

  const currencyAmount = await input({ message: `Now please enter how much ${names[currencyIn]} you want to convert into ${names[currencyOut]} (${currencyIn} -> ${currencyOut})` })
  const currencyAmountFormatted = currencyAmount.replace(/\D/g, '')
  console.log(`Converting ${currencyAmountFormatted} ${currencyIn} into ${currencyOut}...`)

  const currencyFinal = currencyAmountFormatted * curr[currencyIn][currencyOut]
  if (!Number.isInteger(currencyFinal)) {
    console.log(`${Number(currencyFinal.toString())} ${currencyOut}`)
    return Number(currencyFinal.toString())
  }
  console.log(`${currencyFinal} ${currencyOut}`)
  return currencyFinal
}

export default cli
