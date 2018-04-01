<script>
import { mapState } from 'vuex'

export default {
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
