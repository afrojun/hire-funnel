<script>
import moment from 'moment'
import { mapState } from 'vuex'

import { CreateStage } from '~/graphql/stages'
import { UserQuery } from '~/graphql/users'

import UpdateStageModal from '~/components/UpdateStageModal'

export default {
  name: 'Funnel',

  head () {
    return { title: 'Funnel' }
  },

  middleware: 'authenticated',

  components: {
    UpdateStageModal
  },

  data () {
    return {
      name: null,
      showAddStage: false
    }
  },

  computed: {
    ...mapState(['user']),

    funnel () {
      return this.user.organization.funnels.find(funnel =>
        funnel.slug === this.$route.params.funnelId
      )
    },

    organization () {
      return this.user.organization
    },

    nextIndex () {
      return this.funnel.stages.length
    }
  },

  methods: {
    formatSLA (sla) {
      return moment.duration(sla, 'seconds').humanize()
    },

    async createStage () {
      try {
        const funnelId = this.funnel.id
        const userId = this.user.id

        await this.$apollo.mutate({
          mutation: CreateStage,
          variables: {
            name: this.name,
            funnelId: this.funnel.id,
            index: this.nextIndex
          },
          update (store, { data: { createStage } }) {
            console.log(createStage)
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            const funnel = data.user.organization.funnels.find(funnel => funnel.id === funnelId)
            funnel.stages.push(createStage)

            store.writeQuery({
              query: UserQuery,
              variables: { id: userId },
              data
            })
          }
        })

        console.log('created stage')
        this.showAddStage = false
      } catch (error) {
        console.error(error)
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
        <div class="headline">Funnel: {{ funnel.jobTitle }}</div>
        <v-layout column>
          <v-flex xs12 sm6 md3 v-for="stage in funnel.stages" :key="stage.id" >
            <v-card>
              <v-card-title primary-title>
                <div class="subheading">{{ stage.name }}</div>
              </v-card-title>

              <v-card-text>
                <v-layout column>
                  <v-flex xs12 sm6 md6>
                    <div>{{ stage.description }}</div>
                    <div class="grey--text"># Candidates: {{ funnel.candidates.length }}</div>
                    <div class="grey--text">SLA: {{ formatSLA(funnel.sla) }}</div>
                  </v-flex>

                  <v-flex xs12 sm6 md6>
                    <v-card>
                      <v-card-title primary-title>
                        <div class="body-2">Candidate</div>
                      </v-card-title>
                    </v-card>
                  </v-flex>
                </v-layout>

              </v-card-text>

              <v-card-actions>
                <update-stage-modal :user="user" :funnelId="funnel.id" :stage="stage"/>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-btn
            large
            dark
            v-if="!showAddStage"
            color="purple"
            @click="showAddStage = !showAddStage">
            Add a Stage
          </v-btn>
          <v-card hover v-if="showAddStage">
            <v-card-title primary-title>
              <div>
                <v-text-field
                  @keyup.enter="createStage"
                  v-model="name"
                  label="Name"/>
              </div>
            </v-card-title>
          </v-card>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
