import {
  CONNECT_WALLET, CREATE_WEB3_INSTANCE,
  GET_AVAILABLE_TOKENS, GET_EXCHANGE_ESTIMATE,
  GET_WALLET_BALANCE, RESET_DATA, SAVE_SWAP_DATA, SAVE_TX_DATA,
  SET_LOADING_STATE
} from 'store/actions/actionTypes'
import { updateObject } from 'utils'

const initialState = {
  loadingState: '',
  availableTokens: [],
  userWallet: '',
  userBalance: 0,
  exchangeEstimate: {
    fromTokenAmount: 1,
    toTokenAmount: 0,
  },
  swapEstimate: null,
  web3: null,
  txData: null,
}

export function dataReducer (state = initialState, action ) {
  switch (action.type) {
    case SET_LOADING_STATE: return updateObject(state, { loadingState: action.payload })
    case CONNECT_WALLET: return updateObject(state, { userWallet: action.payload })
    case GET_WALLET_BALANCE: return updateObject(state, { userBalance: action.payload })
    case GET_AVAILABLE_TOKENS: return updateObject(state, { availableTokens: action.payload })
    case GET_EXCHANGE_ESTIMATE: return updateObject(state, { exchangeEstimate: action.payload })
    case CREATE_WEB3_INSTANCE: return updateObject(state, { web3: action.payload })
    case SAVE_SWAP_DATA: return updateObject(state, { swapEstimate: action.payload })
    case SAVE_TX_DATA: return updateObject(state, { txData: action.payload })
    case RESET_DATA: return updateObject(state, {
      exchangeEstimate: {
        fromTokenAmount: 1,
        toTokenAmount: 0
      },
      swapEstimate: null
    })
    default: return state
  }
}
