import IconBitcoin from 'assets/icons/IconBitcoin'
import IconEthereum from 'assets/icons/IconEthereum'

export const DeviceTypes = {
  DESKTOP: 'desktop',
  ADAPTIVE: 'adaptive'
}

export const LangOptions = [
  {
    label: 'English',
    value: 'EN'
  },
  {
    label: 'Ukrainian',
    value: 'UA'
  },
]

export const CurrencyOptions = [
  {
    label: 'BTC',
    value: 'BTC',
    descriptor: '0xBitcoin Token',
    icon: IconBitcoin
  },
  {
    label: 'ELET',
    value: 'ELET',
    icon: IconEthereum,
    descriptor: 'Elementeum Games'
  },
]

export const gasFeeOptions = [
  {
    value: '87 Standart',
    isDefault: true
  },
  {
    value: '93 Fast'
  },
  {
    value: '102 Instant'
  },
]

export const gasFeeOptionsAdaptive = [
  {
    value: '87',
    isDefault: true
  },
  {
    value: '93'
  },
  {
    value: '102'
  },
]

export const priceSlippageOptions = [
  {
    value: '0.1%',
  },
  {
    value: '0.5%',
  },
  {
    value: '1%',
    isDefault: true
  },
  {
    value: '3%',
  },
]
