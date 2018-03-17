<script>
import moment from 'moment'

export default {
  name: 'Index',

  head () {
    return { title: 'Index' }
  },

  data () {
    return {
      time: moment()
    }
  }
}
</script>

<template>
  <v-layout column justify-center align-center>
    <v-jumbotron color="grey lighten-2">
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3">Hire Funnel</h3>
            <v-btn large color="primary" class="mx-0">See more</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">Funnel</v-card-title>
        <v-card-text>
          <p>Your hiring funnel.</p>
          <hr class="my-3">
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat nuxt to="/">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
