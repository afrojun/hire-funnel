<script>
import Home from '~/components/Home'

export default {
  name: 'Index',

  head () {
    return { title: 'Index' }
  },

  components: {
    Home
  }
}
</script>

<template>
  <div>
    <home />
  </div>
</template>
