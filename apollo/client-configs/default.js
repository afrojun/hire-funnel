import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const GRAPHQL_ALIAS = 'cjeyw8bem0hsg0145prdcucgn'

export default (ctx) => {
  const httpLink = new HttpLink({ uri: `https://api.graph.cool/simple/v1/${GRAPHQL_ALIAS}` })

  // middleware
  const middlewareLink = new ApolloLink((operation, forward) => {
    const token = process.server ? ctx.req.session : window.__NUXT__.state.session

    operation.setContext({
      headers: { authorization: `Bearer ${token}` }
    })
    return forward(operation)
  })
  const link = middlewareLink.concat(httpLink)
  return {
    link,
    cache: new InMemoryCache()
  }
}
