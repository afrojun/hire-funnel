export default {
  computed: {
    organizationRoute () {
      return `/${this.organization.slug}`
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
      if (this.user && this.organization) {
        return this.organizationRoute
      } else {
        return this.homeRoute
      }
    },

    isOrgIndexRoute () {
      return this.$route.name === 'orgId'
    },

    isOrgFunnelRoute () {
      return this.$route.name === 'orgId-funnelId'
    },

    isOrgSettingsRoute () {
      return this.$route.name === 'orgId-settings'
    }
  },

  methods: {
    funnelRoute (funnelId) {
      return `${this.organizationRoute}/${funnelId}`
    }
  }
}
