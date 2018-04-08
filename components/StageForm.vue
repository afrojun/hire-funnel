<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    stage: {
      type: Object,
      default: () => {
        return {
          name: null,
          description: null,
          sla: 86400,
          advancePolicy: 'Unanimous'
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
      dialog: false,
      name: this.stage.name,
      description: this.stage.description,
      sla: this.stage.sla,
      advancePolicy: this.stage.advancePolicy
    }
  },

  computed: {
    slaOptions () {
      return [
        { text: '12 hours', value: 43200 },
        { text: '24 hours', value: 86400 },
        { text: '2 days', value: 172800 },
        { text: '5 days', value: 432000 }
      ]
    },

    policyOptions () {
      return ['Unanimous', 'Majority', 'Override']
    },

    formVars () {
      return {
        name: this.name,
        description: this.description,
        sla: this.sla,
        advancePolicy: this.advancePolicy
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
          <v-flex xs12>
            <v-text-field v-model="name" label="Name" required />
          </v-flex>
          <v-flex xs12>
            <v-text-field v-model="description" label="Description" />
          </v-flex>
          <v-flex xs12 md6 sm4>
            <v-select
              v-model="sla"
              label="SLA"
              required
              :items="slaOptions" />
          </v-flex>
          <v-flex xs12 md6 sm4>
            <v-select
              v-model="advancePolicy"
              label="Advance Policy"
              required
              :items="policyOptions" />
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