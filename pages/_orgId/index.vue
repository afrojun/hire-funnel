<script>
import moment from 'moment'
import vuetifyToast from 'vuetify-toast'
import { remove } from 'lodash'
import { mapState } from 'vuex'

import routeMixin from '~/mixins/routeMixin'

import { DeleteFunnel } from '~/graphql/funnels'
import { UserQuery } from '~/graphql/users'

import CreateFunnelModal from '~/components/funnel/CreateFunnelModal'
import UpdateFunnelModal from '~/components/funnel/UpdateFunnelModal'

export default {
  name: 'Organization',

  head () {
    return { title: 'Organization' }
  },

  middleware: 'authenticated',

  mixins: [routeMixin],

  components: {
    CreateFunnelModal,
    UpdateFunnelModal
  },

  computed: {
    ...mapState(['user']),

    organization () {
      return this.user && this.user.organization
    }
  },

  methods: {
    formatSLA (sla) {
      return `${moment.duration(sla, 'seconds').asDays()} days`
    },

    async updateFunnel (funnel) {
      try {
        const userId = this.user.id

        await this.$apollo.mutate({
          mutation: DeleteFunnel,
          variables: { id: funnel.id },
          update (store, { data: { updateFunnel } }) {
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            remove(data.user.organization.funnels, funnel => {
              return funnel.id === updateFunnel.id
            })

            store.writeQuery({
              query: UserQuery,
              variables: { id: userId },
              data
            })
          }
        })
      } catch (error) {
        console.error(error)
      }
    },

    async deleteFunnel (funnel) {
      try {
        const userId = this.user.id

        await this.$apollo.mutate({
          mutation: DeleteFunnel,
          variables: { id: funnel.id },
          update (store, { data: { deleteFunnel } }) {
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            remove(data.user.organization.funnels, funnel => {
              return funnel.id === deleteFunnel.id
            })

            store.writeQuery({
              query: UserQuery,
              variables: { id: userId },
              data
            })
          }
        })
      } catch (error) {
        console.error(error)
        vuetifyToast.error('Unable to delete this funnel')
      }
    }
  },

  mounted () {
  }
}
</script>

<template>
  <v-layout column v-if="organization">
    <v-flex xs12 sm6>
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm6 md3 v-for="funnel in organization.funnels" :key="funnel.slug" >
            <v-card hover :to="funnelRoute(funnel.slug)">
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{ funnel.jobTitle }}</div>
                </div>
              </v-card-title>

              <v-card-text>
                <div>{{ funnel.description || '-' }}</div>
                <div class="grey--text"># Candidates: {{ funnel.candidates.length }}</div>
                <div class="grey--text"># Stages: {{ funnel.stages.length }}</div>
                <div class="grey--text">SLA: {{ formatSLA(funnel.sla) }}</div>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <update-funnel-modal :user="user" :funnel="funnel" />
                <v-btn
                  icon small dark color="red lighten-2"
                  @click.prevent="deleteFunnel(funnel)">
                  <v-icon>remove</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
        <create-funnel-modal :user="user"/>
      </v-container>
    </v-flex>
  </v-layout>
</template>
