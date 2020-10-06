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
import { getTokens, toggleModal } from 'store/actions'
import ModalWallet from 'components/Modal/ModalWallet/ModalWallet'
import axiosCarrota from 'axiosCarrota'
import IconBitcoin from 'assets/icons/IconBitcoin'
import Customization from 'Pages/Home/Customization/Customization'
import Preloader from 'components/Preloader/Preloader'
import Calculator from 'Pages/Home/Calculator/Calculator'
import useDebounce from 'hooks/useDebounce'
import ModalWarning from 'components/Modal/ModalWarning/ModalWarning'
import Web3 from 'web3'
import { miniABI } from 'components/ExchangeIntroForm/_assets/miniABI'

const ExchangeIntroForm = ({ className, deviceType }) => {
  const dispatch = useDispatch()
  const loadingState = useSelector(state => state.data.loadingState)
  const userWallet = useSelector(state => state.data.userWallet)
  const tokens = useSelector(state => state.data.availableTokens)
    .map(({ symbol, name, address }) => ({
      label: symbol,
      value: address,
      descriptor: name,
      icon: IconBitcoin
    }))

  const { register, control, watch, setValue, handleSubmit, getValues } = useForm()
  const defaultSource = tokens.find(item => item.label === 'USDT')
  const selectedSource = watch('source', defaultSource)
  const valueSource = watch('source-input') || 0
  const debouncedSourceValue = useDebounce(+valueSource, 1000)
  const defaultResult = tokens[1]
  const selectedResult = watch('result', defaultResult) || {}
  // const radioFee = watch('radio input gas-fee')
  // const inputFee = watch('manual input gas-fee')

  const handleExchangeClick = data => {
    const dataRequest = {
      addressFrom: userWallet,
      amount: 1,
      from: data.source.label,
      to: data.result.label
    }

    axiosCarrota.post('/exchange/swap', dataRequest)
      .then(response => {
        const {to, gas, gasPrice, value, data} = response.data

        const dataExchange = {
          from: userWallet,
          to,
          gas: `0x${(+gas).toString(16)}`,
          gasPrice: `0x${(+gasPrice).toString(16)}`,
          // value: `0x${(+value).toString(16)}`,
          data
        }

        const web3 = new Web3(window.ethereum)
        const decimals = web3.utils.toBN(selectedSource.decimals)
        const amount = web3.utils.toBN(dataRequest.amount)
        const contract = new web3.eth.Contract(miniABI, selectedSource.value)
        const valueToSend = amount.mul(web3.utils.toBN(10).pow(decimals))
        // contract.methods.balanceOf(userWallet)
        //   .call()
        //   .then(response => {
        //     console.log(response)
        //   })

        contract.methods.transfer(to, valueToSend).send({ ...dataExchange }).on('transactionHash', hash => {
          console.log(hash)
          localStorage.setItem('lastTransactionHash', hash)
        })
      })
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
    dispatch(getTokens())
  }, [dispatch])

  return (
    <div className={classnames(css.wrapper, className)}>
      <form onSubmit={handleSubmit(handleExchangeClick)}>
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
          label={userWallet ? 'Exchange now' : 'Connect Your Wallet'}
          type={userWallet ? 'submit' : 'button'}
          onClick={userWallet ? undefined : handleConnectClick}
        />
      </form>
    </div>
  )
}

export default ExchangeIntroForm
