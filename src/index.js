import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css'
import 'styles/common.scss'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker';
import elasticAdaptive from 'store/reducers/elasticAdaptive'
import App from 'App'
import thunk from 'redux-thunk'
import { BrowserRouter } from 'react-router-dom'
import { uiReducer } from 'store/reducers/ui'
import { dataReducer } from 'store/reducers/data'

const rootReducer = combineReducers({
  elastic: elasticAdaptive,
  ui: uiReducer,
  data: dataReducer
})

const store = createStore(rootReducer,applyMiddleware(thunk))

const Content = (
  <Provider store={store}>
    <BrowserRouter basename='/carrota/static/'>
      <App />
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(Content, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
