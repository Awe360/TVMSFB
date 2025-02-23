'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../store'
const StoreProvider = ({Children}) => {
  return (
    <Provider store={store}>
      {Children}

    </Provider>
  )
}

export default StoreProvider