import Cookie from 'js-cookie'
import auth0 from 'auth0-js'

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`

export const webAuth = () => {
  return new auth0.WebAuth({
    audience: 'https://hirefunnel.eu.auth0.com/api/v2/',
    clientID: '77CRmShfKo04gkXEBRginosvIcE4QkDN',
    domain: 'hirefunnel.eu.auth0.com',
    redirectUri: `${getBaseUrl()}/auth/callback`,
    responseType: 'token'
  })
}
export const parseHash = () => {
  const token = webAuth().parseHash((err, authResult) => {
    if (err) return console.error(err)
    let accessToken = null
    if (authResult && authResult.accessToken) {
      window.location.hash = ''
      accessToken = authResult.accessToken
    }
    return accessToken
  })
  return token
}

const getQueryParams = () => {
  const params = {}
  window.location.href.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    params[$1] = $3
  })
  return params
}

export const extractInfoFromHash = () => {
  if (process.SERVER_BUILD) return
  const data = getQueryParams()
  return {
    token: data['access_token'],
    secret: data['state']
  }
}

export const storeLoginData = (userId, nodeToken, accessToken) => {
  if (process.SERVER_BUILD) return
  window.localStorage.setItem('userId', userId)
  window.localStorage.setItem('nodeToken', nodeToken)
  window.localStorage.setItem('auth0Token', accessToken)
  Cookie.set('userId', userId)
  Cookie.set('nodeToken', nodeToken)
  Cookie.set('auth0Token', accessToken)
}

export const forgetLoginData = () => {
  if (process.SERVER_BUILD) return
  window.localStorage.removeItem('auth0Token')
  window.localStorage.removeItem('nodeToken')
  window.localStorage.removeItem('userId')
  Cookie.remove('auth0Token')
  Cookie.remove('nodeToken')
  Cookie.remove('userId')
  window.localStorage.setItem('logout', Date.now())
}

export const getUserIdFromCookie = (req) => {
  if (!req.headers.cookie) return
  const userIdCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('userId='))
  if (!userIdCookie) return
  return userIdCookie.split('=')[1]
}

export const getUserIdFromLocalStorage = () => {
  return window.localStorage.userId
}

export const setSecret = (secret) => window.localStorage.setItem('secret', secret)

export const checkSecret = (secret) => window.localStorage.secret === secret

export const logout = () => webAuth().logout({ returnTo: getBaseUrl() })
