export const state = () => ({
  sidebar: false,
  profile: null,
  wtfMoments: null
})

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  }
}
