<script>
import { mapState } from 'vuex'

export default {
  name: 'User',

  head () {
    return { title: 'User' }
  },

  middleware: 'authenticated',

  computed: {
    ...mapState(['user'])
  }
}
</script>

<template>
  <div class="headline">Hello {{ user.firstName }}</div>
</template>
