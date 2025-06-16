import { createContext, useContext } from 'react'

export const HistoryContext = createContext<string | null>(null)

export const useHistory = () => useContext(HistoryContext)
