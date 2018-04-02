<script>
import { mapState } from 'vuex'

export default {
  name: 'OrgSettings',

  head () {
    return { title: 'Organization Settings' }
  },

  middleware: 'authenticated',

  computed: {
    ...mapState(['user'])
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
