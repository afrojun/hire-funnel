export const state = () => ({
  user: null,
  organization: null
})

export const mutations = {
  setUser (state, user) {
    state.user = user
  },

  setOrganization (state, organization) {
    state.organization = organization
  }
}
