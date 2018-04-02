<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'OrgSettings',

  head () {
    return { title: 'Organization Settings' }
  },

  middleware: 'authenticated',

  computed: {
    ...mapState(['user', 'organization'])
  },

  methods: {
    ...mapMutations(['setOrganization'])
  },

  updated () {
    console.log(this.$route.name)
  }
}
</script>

<template>
  <div>
    <p>Org settings page</p>
  </div>
</template>
