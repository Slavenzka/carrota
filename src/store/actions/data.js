import {
  CONNECT_WALLET,
  CREATE_WEB3_INSTANCE,
  GET_AVAILABLE_TOKENS,
  GET_EXCHANGE_ESTIMATE,
  GET_WALLET_BALANCE,
  RESET_DATA,
  SAVE_SWAP_DATA,
  SAVE_TX_DATA,
  SET_LOADING_STATE,
} from 'store/actions/actionTypes'
import { setButtonType, toggleModal } from 'store/actions/ui'
import React from 'react'
import ModalWarning from 'components/Modal/ModalWarning/ModalWarning'
import axiosCarrota from 'axiosCarrota'
import { gasFeeOptionsAdaptive, LoadingStates } from 'utils/const'
import { ActionButtonTypes } from 'utils/ActionButtonTypes'
import Web3 from 'web3'
import { erc20ABI } from 'abis/erc20ABI'
import BigNumber from 'bignumber.js'
import { checkAllowance, tokenApproveSequence } from 'utils/exchangerInteraction'

export const setLoadingState = newState => ({
  type: SET_LOADING_STATE,
  payload: newState
})

export const createWeb3Instance = () => {
  return {
    type: CREATE_WEB3_INSTANCE,
    payload: new Web3(window.ethereum)
  }
}

export const getWalletBalance = wallet => {
  return dispatch => {
    window.ethereum
      .request({
        method: `eth_getBalance`,
        params: [
          `${wallet}`,
          `latest`
        ]
      })
      .then(response => {
        const balance = !isNaN(parseInt(`${response}`, 10))
          ? parseInt(`${response}`, 10)
          : 0

        dispatch({
          type: GET_WALLET_BALANCE,
          payload: balance
        })
      })
  }
}

export const  connectWallet = walletType => {
  return dispatch => {
    switch (walletType) {
      default:
        const isExtensionAvailable = !!window.ethereum

        if (!isExtensionAvailable) {
          dispatch(toggleModal(true, (
            <ModalWarning
              label={ `Metamask extension is not installed. Please, install it to proceed with the exchange.` }
              url={ `https://metamask.io/download.html` }
              walletType={walletType}
            />
          )))
        } else {
          window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(() => {
              const userWallet = window.ethereum.selectedAddress

              dispatch({
                type: CONNECT_WALLET,
                payload: userWallet
              })

              dispatch(createWeb3Instance())
              dispatch(getWalletBalance(userWallet))
              dispatch(toggleModal(false, null))
              dispatch(setButtonType(ActionButtonTypes.APPROVE))
            })
            .catch(error => {
              if (error.code === 4001) {
                dispatch(toggleModal(true, (
                  <ModalWarning
                    label={ `Metamask extension is not connected to this page. Please, connect it via metamask extension interface manually or choose wallet again.` }
                    walletType={walletType}
                  />
                )))
              } else {
                console.error(error)
              }
            })
        }
    }
  }
}

export const getTokens = () => {
  return dispatch => {
    dispatch(setLoadingState(LoadingStates.TOKENS_LOADING))
    axiosCarrota.get('/exchange/supported-tokens')
      .then(response => {
        const fetchedData = response?.data || {}

        dispatch(setLoadingState(LoadingStates.TOKENS_LOADED))

        dispatch({
          type: GET_AVAILABLE_TOKENS,
          payload: Object.values(fetchedData)
        })
      })
      .catch(() => {
        dispatch(setLoadingState(LoadingStates.TOKENS_LOAD_ERROR))
      })
  }
}

export const getExchangeEstimate = (amount, from, to) => {
  return (dispatch, getState) => {
    const loadingState = getState().data.loadingState
    const isLoading = loadingState === LoadingStates.ESTIMATE_LOADING || loadingState === LoadingStates.APPROVE_IN_PROCESS

    if (!isLoading) {
      dispatch(setLoadingState(LoadingStates.ESTIMATE_LOADING))

      const data = {
        amount,
        from,
        to
      }

      axiosCarrota.post('/exchange/estimate', data)
        .then(response => {
          dispatch(setLoadingState(LoadingStates.ESTIMATE_LOADED))
          console.log(response.data)

          dispatch({
            type: GET_EXCHANGE_ESTIMATE,
            payload: response.data
          })
        })
        .catch(() => dispatch(setLoadingState(LoadingStates.ESTIMATE_ERROR)))
    }
  }
}

export const saveSwapData = fetchedData => {
  return {
    type: SAVE_SWAP_DATA,
    payload: fetchedData
  }
}

export const approveTransaction = data => {
  return (dispatch, getState) => {
    console.log(data)

    const userWallet = getState().data.userWallet
    const web3 = getState().data.web3
    const tokenInstance = new web3.eth.Contract(erc20ABI, data.source.value)
    const amountToExchange = data[`source-input`]
    const selectedSource = data.source
    const amountWithDecimals = new BigNumber(amountToExchange).shiftedBy(data.source.decimals).toFixed()

    const dataForWrapRequest = {
      addressFrom: userWallet,
      amount: Number((+amountToExchange).toFixed(4)),
      from: data.source.label,
      to: data.result.label
    }

    dispatch(setLoadingState(LoadingStates.ESTIMATE_LOADING))
    axiosCarrota.post('/exchange/swap', dataForWrapRequest)
      .then(response => {
        dispatch(setLoadingState(LoadingStates.ESTIMATE_LOADED))
        const {to, gas, gasPrice, data} = response.data
        dispatch(saveSwapData(response.data))

        checkAllowance(userWallet, tokenInstance, selectedSource, amountToExchange)
          .then(allowanceStatus => {
            return tokenApproveSequence({
              allowanceStatus,
              tokenInstance,
              amountWithDecimals,
              gasFeeOptionsAdaptive,
              userWallet,
              gasPrice
            })
          })
          .then(status => {
            console.log(`Status before swap: ${status}`)
            dispatch(setButtonType(ActionButtonTypes.SWAP))
          })
      })
  }
}

export const executeSwap = () => {
  return (dispatch, getState) => {
    console.log('Swap!')
    const web3 = getState().data.web3
    const userWallet = getState().data.userWallet
    const swapCalculation = getState().data.swapEstimate
    const { to, gasPrice, data } = swapCalculation

    const dataToBeSent = {
      from: userWallet,
      to,
      gas: `0x${(500000).toString(16)}`,
      gasPrice: `${gasPrice}`,
      data
    }

    web3.eth.sendTransaction({...dataToBeSent})
      .then(response => {
        console.log(response)
        dispatch(saveTxHash(response))
        // localStorage.setItem('lastCarottaTransactionHash', transactionHash)
      })
      .catch(error => {
        console.log('Send transaction error!')
        console.log(error)
      })
  }
}

export const saveTxHash = data => ({
  type: SAVE_TX_DATA,
  payload: data
})

export const resetData = () => ({
  type: RESET_DATA
})
