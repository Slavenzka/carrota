import { CONNECT_WALLET } from 'store/actions/actionTypes'
import { updateObject } from 'utils'

const initialState = {
  isWalletConnected: false,
  userWallet: ''
}

export function dataReducer (state = initialState, action ) {
  switch (action.type) {
    case CONNECT_WALLET: return updateObject(state, { userWallet: action.payload })
    default: return state
  }
}
