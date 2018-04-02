<script>
import Home from '~/components/Home'

export default {
  name: 'Index',

  head () {
    return { title: 'Index' }
  },

  middleware: 'anonymous',

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
