<script>
import moment from 'moment'
import vuetifyToast from 'vuetify-toast'

import { remove } from 'lodash'
import { mapState } from 'vuex'

import { DeleteStage } from '~/graphql/stages'
import { UserQuery } from '~/graphql/users'

import draggable from 'vuedraggable'
import AddCandidateModal from '~/components/candidate/AddCandidateModal'
import ScheduleInterviewModal from '~/components/candidate/ScheduleInterviewModal'
import CreateStageModal from '~/components/stage/CreateStageModal'
import UpdateStageModal from '~/components/stage/UpdateStageModal'

export default {
  name: 'Funnel',

  head () {
    return { title: 'Funnel' }
  },

  middleware: 'authenticated',

  components: {
    draggable,
    AddCandidateModal,
    ScheduleInterviewModal,
    CreateStageModal,
    UpdateStageModal
  },

  data () {
    return {
      showStages: {}
    }
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

    collapseStages () {
      this.funnel.stages.forEach(stage => {
        this.$set(this.showStages, stage.id, false)
      })
    },

    expandStages () {
      this.funnel.stages.forEach(stage => {
        this.$set(this.showStages, stage.id, true)
      })
    },

    toggleStage (stage) {
      this.$set(this.showStages, stage.id, !this.showStages[stage.id])
    },

    async deleteStage (stage) {
      try {
        const funnelId = this.funnel.id
        const userId = this.user.id

        await this.$apollo.mutate({
          mutation: DeleteStage,
          variables: { id: stage.id },
          update (store, { data: { deleteStage } }) {
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            const funnel = data.user.organization.funnels.find(funnel => funnel.id === funnelId)

            remove(funnel.stages, stage => {
              return stage.id === deleteStage.id
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
        vuetifyToast.error('Unable to delete this stage')
      }
    }
  }
}
</script>

<template>
  <v-container v-if="funnel">
    <v-layout row wrap>
      <v-flex xs12>
        <span class="headline">Funnel: {{ funnel.jobTitle }}</span>
      </v-flex>
      <v-flex xs12>
        <p class="subheading">{{ funnel.description }}</p>
      </v-flex>
      <v-flex xs12 class="text-xs-center text-sm-left">
        <p class="title">Stages</p>
      </v-flex>
      <v-flex xs12>
        <v-layout row>
          <v-flex xs6 sm3 md2 offset-sm6 offset-md8>
            <v-btn flat @click.prevent="expandStages">
              Expand all
              <v-icon>expand_more</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs6 sm3 md2>
            <v-btn flat @click.prevent="collapseStages">
              Collapse all
              <v-icon>expand_less</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-card class="mv-2" v-for="stage in funnel.stages" :key="stage.id">
      <v-card-title class="pa-2">
        <v-container class="pa-0" slot="header">
          <v-layout row wrap align-center>
            <v-flex xs10 sm4 order-xs1 order-sm1>
              <span class="subheading">{{ stage.name }}</span>
            </v-flex>

            <v-flex xs12 sm6  order-xs4 order-sm2>
              <v-tooltip top>
                <span class="pt-2 pr-4" slot="activator">
                  <v-icon>people</v-icon> {{ stage.candidates.length }}
                </span>
                <span>Number of Candidates</span>
              </v-tooltip>
              <v-tooltip top>
                <span class="pt-2 pr-4" slot="activator">
                  <v-icon>access_time</v-icon> {{ formatSLA(stage.sla) }}
                </span>
                <span>SLA in days</span>
              </v-tooltip>
              <v-tooltip top>
                <span class="pt-2 pr-4" slot="activator">
                  <v-icon>fast_forward</v-icon> {{ stage.advancePolicy }}
                </span>
                <span>Advance Policy</span>
              </v-tooltip>
            </v-flex>

            <v-flex xs1 sm1 order-xs2 order-sm3 class="text-xs-right">
              <v-btn class="ma-0 pr-2" icon @click.native="toggleStage(stage)">
                <v-icon>
                  {{ showStages[stage.id] ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
                </v-icon>
              </v-btn>
            </v-flex>

            <v-flex xs1 sm1 order-xs3 order-sm4 class="text-xs-right">
              <v-menu open-on-hover offset-y left>
                <v-btn class="ma-0" icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile @click="">
                    <update-stage-modal :user="user" :funnelId="funnel.id" :stage="stage"/>
                  </v-list-tile>
                  <v-list-tile @click="deleteStage(stage)">
                    <v-list-tile-title>Delete</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-title>

      <v-slide-y-transition>
        <v-card-text class="grey lighten-4" v-show="showStages[stage.id]">
          {{ stage.description }}
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex xs12 sm4 md3 lg2 v-for="candidate in stage.candidates" :key="candidate.id">
                <v-card hover>
                  <v-card-title primary-title>
                    <div class="body-2">
                      {{ `${candidate.firstName} ${candidate.lastName}` }}
                    </div>
                  </v-card-title>
                  <v-card-text>
                    <div v-if="candidate.interviews.length > 0">
                      Interviews:
                      <div v-for="interview in candidate.interviews" :key="interview.id">
                        <p>{{ interview.date }}</p>
                      </div>
                    </div>
                    <div v-else>
                      Schedule an interview for this candidate
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-flex xs4>
                      <schedule-interview-modal
                        :user="user"
                        :funnelId="funnel.id"
                        :stage="stage"
                        :candidate="candidate" />
                    </v-flex>
                  </v-card-actions>
                </v-card>
              </v-flex>

            </v-layout>
          </v-container>
        </v-card-text>
      </v-slide-y-transition>
    </v-card>

    <v-layout row>
      <create-stage-modal :user="user" :funnel="funnel"/>
      <add-candidate-modal v-if="funnel.stages.length > 0" :user="user" :funnel="funnel"/>
    </v-layout>
  </v-container>
</template>

<style scoped>
.stage {
  background-color: gray;
}
</style>
