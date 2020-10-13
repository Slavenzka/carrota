import { SET_BUTTON_TYPE, SET_LANG, TOGGLE_MODAL } from 'store/actions/actionTypes'

export const setLang = lang => {
  return {
    type: SET_LANG,
    payload: lang
  }
}

export const toggleModal = (status, content) => {
  return {
    type: TOGGLE_MODAL,
    payload: {
      status,
      content
    }
  }
}

export const setButtonType = type => ({
  type: SET_BUTTON_TYPE,
  payload: type
})
