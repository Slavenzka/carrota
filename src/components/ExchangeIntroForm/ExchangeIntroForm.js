import React, { useState } from 'react'
import css from './ExchangeIntroForm.module.scss'
import classnames from 'classnames'
import InfoBlock from 'components/InfoBlock/InfoBlock'
import {
  CurrencyOptions,
  DeviceTypes,
  gasFeeOptions,
  gasFeeOptionsAdaptive,
  priceSlippageOptions
} from 'utils/const'
import { useForm } from 'react-hook-form'
import { Collapse } from 'react-collapse/lib/Collapse'
import SettingsBlock from 'components/SettingsBlock/SettingsBlock'
import Button from 'components/Button/Button'
import { useSelector } from 'react-redux'
import IconLightning from 'assets/icons/IconLightning'

const ExchangeIntroForm = ({ className, deviceType }) => {
  const [isCollapseOpened, toggleCollapseStatus] = useState(false)
  const isWalletConnected = useSelector(state => state.data.isWalletConnected)

  const { register, control, watch, setValue } = useForm()
  const selectedSource = watch('source')
  const selectedResult = watch('result')
  // const radioFee = watch('radio input gas-fee')
  // const inputFee = watch('manual input gas-fee')

  const handleButtonClick = () => {

  }

  const handleClickToggle = () => {
    const container = Object.assign({}, selectedSource)
    setValue('source', Object.assign({}, selectedResult))
    setValue('result', container)
  }

  return (
    <div className={classnames(css.wrapper, className)}>
      <form>
        <div className={css.currencies}>
          <button
            className={css.buttonToggle}
            onClick={handleClickToggle}
            type='button'
          >
            Toggle currencies
            <IconLightning className={css.icon} />
          </button>
          <InfoBlock
            className={css.item}
            namespace='source'
            options={CurrencyOptions}
            defaultCurrency={CurrencyOptions.find(item => item.value === 'BTC')}
            selectedCurrency={selectedSource}
            control={control}
            label='You have'
            value={0.3}
            legend='≈ 0.3'
            balance={`$ 30 000`}
            isWalletConnected={isWalletConnected}
          />
          <InfoBlock
            className={css.item}
            namespace='result'
            options={CurrencyOptions}
            defaultCurrency={CurrencyOptions.find(item => item.value === 'ELET')}
            selectedCurrency={selectedResult}
            control={control}
            label='You get'
            value={8.89942446}
            legend='≈ 8.79942446 (-0.08%)'
          />
        </div>
        <button
          className={css.buttonCollapse}
          onClick={() => toggleCollapseStatus(state => !state)}
          type='button'
        >
          Customize transaction settings
        </button>
        <Collapse
          isOpened={isCollapseOpened}
          theme={{
            collapse: 'ReactCollapse--collapse',
            content: css.collapseContent
          }}
        >
          <SettingsBlock
            className={css.settings}
            label='GAS Fee'
            hint='Some hint for the gas fee block'
            options={deviceType === DeviceTypes.DESKTOP ? gasFeeOptions : gasFeeOptionsAdaptive}
            register={register}
            namespace='gas-fee'
            setValue={setValue}
          />
          <SettingsBlock
            className={css.settings}
            label='Limit additional price slippage'
            hint='Some hint for the price slippage block'
            options={priceSlippageOptions}
            register={register}
            namespace='price-slippage'
            setValue={setValue}
          />
        </Collapse>
        {isWalletConnected &&
          <Button
            className={css.button}
            label='Exchange now'
            type='button'
            onClick={handleButtonClick}
          />
        }
      </form>
    </div>
  )
}

export default ExchangeIntroForm
