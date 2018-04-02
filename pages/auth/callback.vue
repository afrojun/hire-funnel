<script>
import EventBus from '~/utils/eventBus'
import { parseHash, storeLoginData } from '~/utils/auth'
import { AuthenticateUser } from '~/graphql/users'

export default {
  methods: {
    async authenticateUser (accessToken) {
      try {
        return await this.$apollo.mutate({
          mutation: AuthenticateUser,
          variables: { accessToken }
        })
      } catch (error) {
        console.error(error)
      }
    },

    async handleAuthCallback () {
      try {
        const accessToken = parseHash()
        const { data: { authenticateUser: { id, token } } } = await this.authenticateUser(accessToken)
        storeLoginData(id, token, accessToken)
        EventBus.$emit('FetchUser', { id })
      } catch (error) {
        console.error(error)
      } finally {
        this.$router.push('/')
      }
    }
  },

  mounted () {
    this.handleAuthCallback()
  }
}
</script>

<template>
  <p>Signing in...</p>
</template>
