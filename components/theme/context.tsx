import React from 'react'

import { globalStyles } from './preflight'

export const ThemeContext = React.createContext<any>({})

export const ThemeProvider = (props: React.PropsWithChildren<{}>) => {
  globalStyles()
  return <ThemeContext.Provider value={{}}>{props.children}</ThemeContext.Provider>
}
