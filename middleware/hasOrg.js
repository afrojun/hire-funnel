export default function ({ store, redirect }) {
  if (store.getters.isAuthenticated && store.state.user.organization) {
    return redirect(`/${store.state.user.organization.slug}`)
  }
}
