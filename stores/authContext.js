import netlifyIdentity from 'netlify-identity-widget'
import { createContext, useEffect, useState } from 'react'

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  authReady: false,
})

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    netlifyIdentity.on('login', (newUser) => {
      setUser(newUser)
      netlifyIdentity.close()
      console.log('Login Event')
    })

    netlifyIdentity.on('logout', () => {
      setUser(null)
      console.log('Logout Event')
    })

    // init netlify identity connection
    netlifyIdentity.init()

    return () => {
      netlifyIdentity.off('login')
      netlifyIdentity.off('logout')
    }
  }, [])

  const login = () => {
    netlifyIdentity.open()
  }

  const logout = () => {
    netlifyIdentity.logout()
  }

  const context = { user, login, logout }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export default AuthContext
