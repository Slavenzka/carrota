import { CONNECT_WALLET, TOGGLE_MODAL } from 'store/actions/actionTypes'
import { toggleModal } from 'store/actions/ui'
import React from 'react'
import ModalWarning from 'components/Modal/ModalWarning/ModalWarning'

export const connectWallet = walletType => {
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

              dispatch({
                type: TOGGLE_MODAL,
                payload: {
                  status: false,
                  content: null
                }
              })
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
