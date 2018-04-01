<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['user', 'organization'])
  },

  methods: {
    ...mapMutations(['setUser'])
  }
}
</script>

<template>
  <div>
    <p>User page</p>
  </div>
</template>
