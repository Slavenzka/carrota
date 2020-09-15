import React from 'react'
import css from './ModalWallet.module.scss'
import Heading from 'components/Heading/Heading'
import IconTrustWallet from 'assets/icons/IconTrustWallet'
import IconMetamask from 'assets/icons/IconMetamask'
import { useDispatch } from 'react-redux'
import { connectWallet, toggleModal } from 'store/actions'

const ModalWallet = () => {
  const wallets = [
    {
      label: 'Trust wallet',
      icon: <IconTrustWallet className={css.icon} />,
    },
    {
      label: 'Metamask',
      icon: <IconMetamask className={css.icon} />,
    },
  ]
  const dispatch = useDispatch()

  const handleWalletClick = () => {
    dispatch(connectWallet())
    dispatch(toggleModal(false, null))
  }

  return (
    <>
      <Heading
        className={css.heading}
        label='Connect Wallet'
        tag='h2'
      />
      <ul className={css.list}>
        {wallets.map(({ label, icon, url }, index) => {
          return (
            <li className={css.item} key={`Wallet item#${index}`}>
              <button
                className={css.button}
                onClick={handleWalletClick}
                type='button'
              >
                {icon || <span>{ label }</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default ModalWallet
