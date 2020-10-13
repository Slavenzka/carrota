import React, { useEffect } from 'react'
import css from './ExchangeIntroForm.module.scss'
import classnames from 'classnames'
import {
  DeviceTypes,
  gasFeeOptions,
  gasFeeOptionsAdaptive, LoadingStates,
  priceSlippageOptions
} from 'utils/const'
import { useForm } from 'react-hook-form'
import SettingsBlock from 'components/SettingsBlock/SettingsBlock'
import Button from 'components/Button/Button'
import { useDispatch, useSelector } from 'react-redux'
import { getTokens, resetData, setButtonType, toggleModal } from 'store/actions'
import ModalWallet from 'components/Modal/ModalWallet/ModalWallet'
import IconBitcoin from 'assets/icons/IconBitcoin'
import Customization from 'Pages/Home/Customization/Customization'
import Preloader from 'components/Preloader/Preloader'
import Calculator from 'Pages/Home/Calculator/Calculator'
import useDebounce from 'hooks/useDebounce'
import ModalSuccess from 'components/Modal/ModalSuccess/ModalSuccess'
import { ActionButtonTypes } from 'utils/ActionButtonTypes'

const DEBOUNCE_DELAY = 500
const DEFAULT_FROM_TOKEN = 'USDT'
const DEFAULT_FROM_AMOUNT = 1
const DEFAULT_TO_TOKEN = 'ETH'

const ExchangeIntroForm = ({ className, deviceType }) => {
  const dispatch = useDispatch()
  const mainButton = useSelector(state => state.ui.submitButtonType)
  const loadingState = useSelector(state => state.data.loadingState)
  const userWallet = useSelector(state => state.data.userWallet)
  const tokens = useSelector(state => state.data.availableTokens)
    .map(({ symbol, name, address, decimals }) => ({
      label: symbol,
      value: address,
      descriptor: name,
      icon: IconBitcoin,
      decimals
    }))
  const txData = useSelector(state => state.data.txData) || {}

  const fromValue = useSelector(state => state.data.exchangeEstimate.fromTokenAmount)
  const { register, control, watch, setValue, handleSubmit, getValues, reset } = useForm({
    defaultValues: {
      [`source-input`]: fromValue
    }
  })
  const defaultSource = tokens.find(item => item.label === DEFAULT_FROM_TOKEN)
  const selectedSource = watch('source', defaultSource)
  const valueSource = watch('source-input') || DEFAULT_FROM_AMOUNT
  const debouncedSourceValue = useDebounce(+valueSource, DEBOUNCE_DELAY)
  const defaultResult = tokens.find(item => item.label === DEFAULT_TO_TOKEN)
  const selectedResult = watch('result', defaultResult) || {}
  // const radioFee = watch('radio input gas-fee')
  // const inputFee = watch('manual input gas-fee')

  const handleButtonClick = () => {
    dispatch(toggleModal(true, <ModalWallet />))
  }

  const handleClickToggle = () => {
    const container = Object.assign({}, selectedSource)
    setValue('source', Object.assign({}, selectedResult))
    setValue('result', container)
  }

  const resetForm = () => {
    reset({
      [`source-input`]: DEFAULT_FROM_AMOUNT,
      [`result-input`]: '',
      [`source`]: tokens.find(item => item.label === DEFAULT_FROM_TOKEN),
      [`result`]: tokens.find(item => item.label === DEFAULT_TO_TOKEN)
    })
  }


  useEffect(() => {
    dispatch(getTokens())
  }, [dispatch])

  useEffect(() => {
    if (txData.transactionHash) {
      dispatch(toggleModal(true, <ModalSuccess data={txData} />))
      dispatch(resetData())
      resetForm()
    }
  }, [txData.transactionHash])

  useEffect(() => {
    if (mainButton === ActionButtonTypes.SWAP) {
      dispatch(setButtonType(ActionButtonTypes.APPROVE))
    }
  }, [selectedSource, selectedResult, valueSource])

  return (
    <div className={classnames(css.wrapper, className)}>
      <form onSubmit={handleSubmit(data => dispatch(mainButton.clickHandler(data)))}>
        <div className={css.currencies}>
          {loadingState === LoadingStates.TOKENS_LOADING &&
            <Preloader className={css.preloader} />
          }
          {loadingState !== LoadingStates.TOKENS_LOADING && tokens && tokens.length > 1 &&
            <Calculator
              register={register}
              control={control}
              handleClickToggle={handleClickToggle}
              supportedTokens={tokens}
              userWallet={userWallet}
              defaultSource={defaultSource}
              selectedSource={selectedSource}
              valueSource={debouncedSourceValue}
              defaultResult={defaultResult}
              selectedResult={selectedResult}
              getValues={getValues}
              setValue={setValue}
              isLoading={loadingState === LoadingStates.ESTIMATE_LOADING || loadingState === LoadingStates.APPROVE_IN_PROCESS}
            />
          }
        </div>
        <Customization>
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
        </Customization>
        <Button
          className={css.button}
          label={mainButton.label}
          type={mainButton.type}
          onClick={mainButton.type === 'button' ? handleButtonClick : undefined}
        />
      </form>
    </div>
  )
}

export default ExchangeIntroForm
