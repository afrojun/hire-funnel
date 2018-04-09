<script>
import templates from '~/config/templates'

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    funnel: {
      type: Object,
      default: () => {
        return {
          jobTitle: null,
          description: null,
          sla: 1209600,
          offerEmailTemplate: templates.offerEmailTemplate,
          rejectionEmailTemplate: templates.rejectionEmailTemplate,
          managerId: null
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
      jobTitle: this.funnel.jobTitle,
      description: this.funnel.description,
      sla: this.funnel.sla,
      offerEmailTemplate: this.funnel.offerEmailTemplate,
      rejectionEmailTemplate: this.funnel.rejectionEmailTemplate,
      managerId: this.funnel.managerId || this.user.id
    }
  },

  computed: {
    managerOptions () {
      return this.user.organization.users.map(user => {
        return { text: user.firstName, value: user.id }
      })
    },

    slaOptions () {
      return [
        { text: '24 hours', value: 86400 },
        { text: '1 week', value: 604800 },
        { text: '2 weeks', value: 1209600 },
        { text: '1 month', value: 2678400 }
      ]
    },

    formVars () {
      return {
        jobTitle: this.jobTitle,
        description: this.description,
        sla: this.sla,
        offerEmailTemplate: this.offerEmailTemplate,
        rejectionEmailTemplate: this.rejectionEmailTemplate,
        managerId: this.managerId
      }
    }
  }
}
</script>

<template>
  <v-card>
    <v-card-title>
      <span class="headline">
        {{ headline }}
      </span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field v-model="jobTitle" label="Job Title" required />
          </v-flex>
          <v-flex xs12>
            <v-text-field v-model="description" label="Description" />
          </v-flex>
          <v-flex xs12 md6 sm4>
            <v-select v-model="sla" label="SLA" required :items="slaOptions" />
          </v-flex>
          <v-flex xs12 md6 sm4>
            <v-select
              v-model="managerId"
              label="Funnel Manager"
              required
              :items="managerOptions" />
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
