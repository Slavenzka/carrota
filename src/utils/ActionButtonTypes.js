import { approveTransaction } from 'store/actions'
import { executeSwap } from 'store/actions/data'

export const ActionButtonTypes = {
  CONNECT: {
    type: 'button',
    label: 'Connect Your Wallet',
  },
  APPROVE: {
    type: 'submit',
    label: 'Approve transaction',
    clickHandler: data => approveTransaction(data)
  },
  SWAP: {
    type: 'submit',
    label: 'Execute exchange',
    clickHandler: () => executeSwap()
  }
}
