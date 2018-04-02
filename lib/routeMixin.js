export default {
  computed: {
    organizationRoute () {
      return `/${this.user.organization.slug}`
    },

    homeRoute () {
      return '/'
    },

    userRoute () {
      return '/user'
    },

    logoutRoute () {
      return '/auth/logout'
    },

    primaryNavRoute () {
      if (this.user && this.user.organization) {
        return this.organizationRoute
      } else {
        return this.homeRoute
      }
    }
  },

  methods: {
    funnelRoute (funnelId) {
      return `${this.organizationRoute}/${funnelId}`
    }
  }
}
