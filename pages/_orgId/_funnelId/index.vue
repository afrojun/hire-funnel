<script>
import moment from 'moment'
import { remove } from 'lodash'
import { mapState } from 'vuex'

import { DeleteStage } from '~/graphql/stages'
import { UserQuery } from '~/graphql/users'

import draggable from 'vuedraggable'
import CreateStageModal from '~/components/CreateStageModal'
import UpdateStageModal from '~/components/UpdateStageModal'

export default {
  name: 'Funnel',

  head () {
    return { title: 'Funnel' }
  },

  middleware: 'authenticated',

  components: {
    draggable,
    CreateStageModal,
    UpdateStageModal
  },

  computed: {
    ...mapState(['user']),

    funnel () {
      return this.user.organization.funnels.find(funnel =>
        funnel.slug === this.$route.params.funnelId
      )
    }
  },

  methods: {
    formatSLA (sla) {
      return `${moment.duration(sla, 'seconds').asDays()}d`
    },

    async deleteStage (stage) {
      try {
        const funnelId = this.funnel.id
        const userId = this.user.id

        await this.$apollo.mutate({
          mutation: DeleteStage,
          variables: { id: stage.id },
          update (store, { data: { deleteStage } }) {
            console.log(deleteStage)
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            console.log(data)
            const funnel = data.user.organization.funnels.find(funnel => funnel.id === funnelId)

            remove(funnel.stages, stage => {
              return stage.id === deleteStage.id
            })
            console.log(data)

            store.writeQuery({
              query: UserQuery,
              variables: { id: userId },
              data
            })
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  },

  mounted () {
    console.log(this.funnel)
  },

  updated () {
    console.log(this.funnel)
  }
}
</script>

<template>
  <v-layout row v-if="funnel">
    <v-flex xs12>
      <v-container fluid grid-list-md>
        <span class="headline mv-3">Funnel: {{ funnel.jobTitle }}</span>

        <p class="subheading">{{ funnel.description }}</p>

        <v-expansion-panel expand popout>
          <v-layout column>
            <v-flex xs12 sm6 md3>
              <v-expansion-panel-content v-for="stage in funnel.stages" :key="stage.id">
                <v-layout row wrap slot="header">
                  <v-flex xs12 sm3>
                    <span class="subheading">{{stage.index}} - {{ stage.name }}</span>
                  </v-flex>
                  <v-flex xs12 sm5>
                    <span>{{ stage.description }}</span>
                  </v-flex>
                  <v-flex xs12 sm4>
                    <v-tooltip left>
                      <span class="pr-4" slot="activator">
                        <v-icon class="pr-1">people</v-icon> {{ stage.candidates.length }}
                      </span>
                      <span>Number of Candidates</span>
                    </v-tooltip>
                    <v-tooltip left>
                      <span class="pr-4" slot="activator">
                        <v-icon class="pr-1">access_time</v-icon> {{ formatSLA(stage.sla) }}
                      </span>
                      <span>SLA in days</span>
                    </v-tooltip>
                    <v-tooltip left>
                      <span class="pr-4" slot="activator">
                        <v-icon class="pr-1">fast_forward</v-icon> {{ stage.advancePolicy }}
                      </span>
                      <span>Advance Policy</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>

                <v-layout row wrap>
                  <v-flex xs12 sm4 md3 lg2 v-for="(item, i) in 10" :key="i">
                    <v-card hover>
                      <v-card-title primary-title>
                        <div class="body-1">Candidate {{i}}</div>
                      </v-card-title>
                    </v-card>
                  </v-flex>

                </v-layout>
                <update-stage-modal :user="user" :funnelId="funnel.id" :stage="stage"/>

                <v-btn
                  @click="deleteStage(stage)"
                  small
                  color="red lighten-2"
                  dark>
                  Delete
                </v-btn>

              </v-expansion-panel-content>
            </v-flex>
          </v-layout>
        </v-expansion-panel>

        <create-stage-modal :user="user" :funnel="funnel"/>
      </v-container>
    </v-flex>
  </v-layout>
</template>
