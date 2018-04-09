<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    candidate: {
      type: Object,
      default: () => {
        return {
          firstName: null,
          lastName: null,
          email: null,
          cellNumber: null
        }
      }
    },
    submitFn: {
      type: Function,
      required: true
    },
    cancelFn: {
      type: Function,
      required: true
    },
    submitText: {
      type: String,
      required: true
    },
    headline: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      firstName: this.candidate.firstName,
      lastName: this.candidate.lastName,
      email: this.candidate.email,
      cellNumber: this.candidate.cellNumber
    }
  },

  computed: {
    formVars () {
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        cellNumber: this.cellNumber
      }
    }
  }
}
</script>

<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ headline }}</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 md6 sm4>
            <v-text-field v-model="firstName" label="First Name" required />
          </v-flex>
          <v-flex xs12 md6 sm4>
            <v-text-field v-model="lastName" label="Last Name" />
          </v-flex>
          <v-flex xs12 md6 sm4>
            <v-text-field v-model="email" label="Email" />
          </v-flex>
          <v-flex xs12 md6 sm4>
            <v-text-field v-model="cellNumber" label="Cell Number" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey darken-1" flat @click.native="cancelFn">Cancel</v-btn>
      <v-btn color="green" flat @click.native="submitFn(formVars)">{{ submitText }}</v-btn>
    </v-card-actions>
  </v-card>
</template>