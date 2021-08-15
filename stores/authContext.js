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
  const [authReady, setAuthReady] = useState(false)

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

    netlifyIdentity.on('init', (user) => {
      setUser(user)
      setAuthReady(true)
      console.log('Init Event')
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

  const context = { user, login, logout, authReady }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export default AuthContext
