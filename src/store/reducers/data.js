import { CONNECT_WALLET } from 'store/actions/actionTypes'
import { updateObject } from 'utils'

const initialState = {
  isWalletConnected: false
}

export function dataReducer (state = initialState, action ) {
  switch (action.type) {
    case CONNECT_WALLET: return updateObject(state, { isWalletConnected: true })
    default: return state
  }
}
