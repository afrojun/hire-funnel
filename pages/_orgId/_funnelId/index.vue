<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Funnel',

  head () {
    return { title: 'Funnel' }
  },

  middleware: 'authenticated',

  computed: {
    ...mapState(['user', 'organization'])
  },

  methods: {
    ...mapMutations(['setFunnel'])
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
