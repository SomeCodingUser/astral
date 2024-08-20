'use client'

import { ChainContext, ChainContextValue } from 'providers/ChainProvider'
import { useContext } from 'react'

export const useChains = (): ChainContextValue => {
  const context = useContext(ChainContext)

  if (!context) throw new Error('ChainContext must be used within ChainProvider')

  return context
}

export default useChains
