<script>
import { mapState, mapMutations } from 'vuex'

export default {
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
