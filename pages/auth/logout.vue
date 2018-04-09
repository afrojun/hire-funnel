<template>
  <p>Signing off...</p>
</template>

<script>
import { mapMutations } from 'vuex'
import { forgetLoginData, logout } from '~/utils/auth'

export default {
  methods: {
    ...mapMutations(['setUser'])
  },

  mounted () {
    this.setUser({ user: null })
    forgetLoginData()
    logout()
  }
}
</script>
