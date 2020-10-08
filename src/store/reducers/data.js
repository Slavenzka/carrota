import {
  CONNECT_WALLET,
  GET_AVAILABLE_TOKENS, GET_EXCHANGE_ESTIMATE,
  GET_WALLET_BALANCE,
  SET_LOADING_STATE, SET_SEARCH_QUERY
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
  searchQuery: ''
}

export function dataReducer (state = initialState, action ) {
  switch (action.type) {
    case SET_LOADING_STATE: return updateObject(state, { loadingState: action.payload })
    case CONNECT_WALLET: return updateObject(state, { userWallet: action.payload })
    case GET_WALLET_BALANCE: return updateObject(state, { userBalance: action.payload })
    case GET_AVAILABLE_TOKENS: return updateObject(state, { availableTokens: action.payload })
    case GET_EXCHANGE_ESTIMATE: return updateObject(state, { exchangeEstimate: action.payload })
    case SET_SEARCH_QUERY: return updateObject(state, { searchQuery: action.payload })
    default: return state
  }
}
