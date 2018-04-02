<script>
import { mapState } from 'vuex'

export default {
  name: 'User',

  head () {
    return { title: 'User' }
  },

  middleware: 'authenticated',

  computed: {
    ...mapState(['user', 'organization'])
  }
}
</script>

<template>
  <div>
    <p>Hello {{ user.firstName }}</p>
  </div>
</template>
