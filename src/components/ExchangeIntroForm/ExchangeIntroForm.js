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
import { getTokens, setLoadingState, toggleModal } from 'store/actions'
import ModalWallet from 'components/Modal/ModalWallet/ModalWallet'
import axiosCarrota from 'axiosCarrota'
import IconBitcoin from 'assets/icons/IconBitcoin'
import Customization from 'Pages/Home/Customization/Customization'
import Preloader from 'components/Preloader/Preloader'
import Calculator from 'Pages/Home/Calculator/Calculator'
import useDebounce from 'hooks/useDebounce'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { erc20ABI } from 'abis/erc20ABI'
import { waitTransaction } from 'utils/exchangerInteraction'

const ExchangeIntroForm = ({ className, deviceType }) => {
  const dispatch = useDispatch()
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

  const fromValue = useSelector(state => state.data.exchangeEstimate.fromTokenAmount)
  const { register, control, watch, setValue, handleSubmit, getValues } = useForm({
    defaultValues: {
      [`source-input`]: fromValue
    }
  })
  const defaultSource = tokens.find(item => item.label === 'USDT')
  const selectedSource = watch('source', defaultSource)
  const valueSource = watch('source-input') || 0
  const debouncedSourceValue = useDebounce(+valueSource, 1000)
  const defaultResult = tokens.find(item => item.label === 'DAI')
  const selectedResult = watch('result', defaultResult) || {}
  // const radioFee = watch('radio input gas-fee')
  // const inputFee = watch('manual input gas-fee')

  const handleExchangeClick = (data, selectedSource) => {
    const web3 = new Web3(window.ethereum)
    const tokenInstance = new web3.eth.Contract(erc20ABI, selectedSource.value)
    const amountToExchange = data[`source-input`]
    const amountToExchangeWithDecimals = new BigNumber(amountToExchange).shiftedBy(data.source.decimals).toFixed()
    let transactionHash = null

    const dataRequest = {
      addressFrom: userWallet,
      amount: Number((+fromValue).toFixed(2)),
      from: data.source.label,
      to: data.result.label
    }

    dispatch(setLoadingState(LoadingStates.ESTIMATE_LOADING))
    axiosCarrota.post('/exchange/swap', dataRequest)
      .then(response => {
        dispatch(setLoadingState(LoadingStates.ESTIMATE_LOADED))
        const { to, gas, gasPrice, data } = response.data
        console.log(response.data)

        const dataExchange = {
          from: userWallet,
          to,
          gas: `0x${(gas).toString(16)}`,
          gasPrice: `0x${(+gasPrice).toString(16)}`,
          data
        }

        dispatch(setLoadingState(LoadingStates.APPROVE_IN_PROCESS))
        tokenInstance.methods.approve(`0xe4c9194962532feb467dce8b3d42419641c6ed2e`, amountToExchangeWithDecimals).send({ from: userWallet }, async function(error, txHash) {
          if (error) {
            console.log("ERC20 could not be approved", error);
            dispatch(setLoadingState(LoadingStates.APPROVE_ERROR))
            return;
          }
          console.log("ERC20 token approved");
          dispatch(setLoadingState(LoadingStates.APPROVE_SUCCESS))
          transactionHash = txHash
          const status = await waitTransaction(web3, txHash);
          if (!status) {
            console.log("Approval transaction failed.");
            return;
          }

          web3.eth.sendTransaction({...dataExchange})
            .then(response => {
              console.log(response)
              localStorage.setItem('lastTransactionCarrotaHash', transactionHash)
            })
            .catch(error => {
              console.log('Send transaction error!')
              console.log(error)
            })
        })
      })
      .catch(error => {
        console.log('Swap error!')
        console.log(error)
        dispatch(setLoadingState(LoadingStates.ESTIMATE_ERROR))
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
      <form onSubmit={handleSubmit(data => handleExchangeClick(data, selectedSource))}>
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
          label={userWallet ? 'Exchange now' : 'Connect Your Wallet'}
          type={userWallet ? 'submit' : 'button'}
          onClick={userWallet ? undefined : handleConnectClick}
        />
      </form>
    </div>
  )
}

export default ExchangeIntroForm
