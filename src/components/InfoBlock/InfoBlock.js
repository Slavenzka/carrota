import React from 'react'
import css from './InfoBlock.module.scss'
import classnames from 'classnames'
import Heading, { HeadingTypes } from 'components/Heading/Heading'
import CurrencyLogo, { CurrencyTypes } from 'components/CurrencyLogo/CurrencyLogo'
import SelectStandard, { SelectStyleTypes } from 'components/Select/SelectStandard'
import { Controller } from 'react-hook-form'

const InfoBlock = ({
  className,
  control,
  label = 'Some label',
  namespace,
  value = 'Some value',
  defaultCurrency = CurrencyTypes.BITCOIN,
  selectedCurrency,
  legend = 'Some legend data',
  options,
  balance,
  isWalletConnected,
}) => {
  const currency = selectedCurrency || defaultCurrency
  console.log(options)
  console.log(currency)
  const filteredOptions = options.filter(item => item.value !== currency.value)

  const icon = <CurrencyLogo type={currency.value} />

  return (
    <div className={classnames(css.wrapper, className)}>
      <Heading
        className={css.key}
        color={HeadingTypes.colors.DARK}
        label={label}
        size={HeadingTypes.size.SMALL}
        tag='h2'
      />
      <p className={css.value}>
        { value }
      </p>
      {balance && isWalletConnected &&
        <p className={css.balance}>
          { `Available balance: ${balance}` }
        </p>
      }
      <Controller
        as={SelectStandard}
        name={namespace}
        control={control}
        defaultValue={defaultCurrency}
        className={css.select}
        options={filteredOptions}
        icon={icon}
        type={SelectStyleTypes.CURRENCY}
      />
      <p className={css.legend}>
        { legend }
      </p>
    </div>
  )
}

export default InfoBlock
