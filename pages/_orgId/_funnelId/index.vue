<script>
import { mapState } from 'vuex'

export default {
  name: 'Funnel',

  head () {
    return { title: 'Funnel' }
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
    <p>Funnel :id page</p>
  </div>
</template>
