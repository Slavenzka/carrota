import React, { useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import IconLightning from 'assets/icons/IconLightning'
import { toggleModal } from 'store/actions'
import ModalWallet from 'components/Modal/ModalWallet/ModalWallet'
import axiosCarrota from 'axiosCarrota'

const ExchangeIntroForm = ({ className, deviceType }) => {
  const dispatch = useDispatch()
  const [isCollapseOpened, toggleCollapseStatus] = useState(false)
  const userWallet = useSelector(state => state.data.userWallet)

  const { register, control, watch, setValue } = useForm()
  const selectedSource = watch('source')
  const selectedResult = watch('result')
  // const radioFee = watch('radio input gas-fee')
  // const inputFee = watch('manual input gas-fee')

  const handleExchangeClick = () => {
  }

  const handleConnectClick = () => {
    dispatch(toggleModal(true, <ModalWallet />))
  }

  const handleClickToggle = () => {
    const container = Object.assign({}, selectedSource)
    setValue('source', Object.assign({}, selectedResult))
    setValue('result', container)
  }

  useEffect(() => {
    if (userWallet) {
      const data = {
        amount: 1,
        from: selectedSource.value,
        to: selectedResult.value
      }

      axiosCarrota.post('/exchange/estimate', data)
        .then(response => {
          console.log(response)
        })
    }
  }, [userWallet])

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
            defaultCurrency={CurrencyOptions.find(item => item.value === 'ETH')}
            selectedCurrency={selectedSource}
            control={control}
            label='You have'
            value={0.3}
            legend='≈ 0.3'
            balance={`$ 30 000`}
            isWalletConnected={userWallet}
          />
          <InfoBlock
            className={css.item}
            namespace='result'
            options={CurrencyOptions}
            defaultCurrency={CurrencyOptions.find(item => item.value === 'DAI')}
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
        <Button
          className={css.button}
          label={userWallet ? 'Exchange now' : 'Connect Your Wallet'}
          type='button'
          onClick={userWallet ? handleExchangeClick : handleConnectClick}
        />
      </form>
    </div>
  )
}

export default ExchangeIntroForm
