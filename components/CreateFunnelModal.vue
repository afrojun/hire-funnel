<script>
import shortid from 'shortid'
import CreateFunnel from '~/graphql/funnels'
import { UserQuery } from '~/graphql/users'
import slugify from '~/utils/slugify'
import templates from '~/config/templates'

export default {
  props: {
    user: {
      required: true,
      type: Object
    }
  },

  data () {
    return {
      dialog: false,
      jobTitle: null,
      description: null,
      sla: 1209600,
      offerEmailTemplate: templates.offerEmailTemplate,
      rejectionEmailTemplate: templates.rejectionEmailTemplate,
      managerId: this.user.id,
      slugSuffix: shortid.generate()
    }
  },

  computed: {
    slug () {
      return `${slugify(this.jobTitle)}-${this.slugSuffix}`
    },

    managerOptions () {
      return this.user.organization.users.map(user => {
        return {
          text: user.firstName,
          value: user.id
        }
      })
    }
  },

  methods: {
    async createFunnel () {
      try {
        const userId = this.user.id
        await this.$apollo.mutate({
          mutation: CreateFunnel,
          variables: {
            slug: this.slug,
            jobTitle: this.jobTitle,
            description: this.description,
            sla: this.sla,
            offerEmailTemplate: this.offerEmailTemplate,
            rejectionEmailTemplate: this.rejectionEmailTemplate,
            organizationId: this.user.organization.id,
            managerId: this.managerId
          },
          update (store, { data: { createFunnel } }) {
            console.log(createFunnel)
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            data.user.organization.funnels.push(createFunnel)

            store.writeQuery({
              query: UserQuery,
              variables: { id: userId },
              data
            })
          }
        })

        console.log('created funnel')
        this.dialog = false
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<template>
  <v-dialog v-model="dialog" persistent max-width="500">
    <v-btn
      large
      color="purple"
      dark
      slot="activator">
      Add funnel
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">Add a new Funnel</span>
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
              <v-select
                v-model="sla"
                label="SLA"
                required
                :items="[
                  { text: '24 hours', value: 86400 },
                  { text: '1 week', value: 604800 },
                  { text: '2 weeks', value: 1209600 },
                  { text: '1 month', value: 2678400 }
                ]" />
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
        <v-btn color="grey darken-1" flat @click.native="dialog = false">Cancel</v-btn>
        <v-btn color="green" flat @click.native="createFunnel">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
