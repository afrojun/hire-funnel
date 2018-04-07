<script>
import moment from 'moment'
import { mapState } from 'vuex'
import CreateFunnelModal from '~/components/CreateFunnelModal'
import routeMixin from '~/mixins/routeMixin'

export default {
  name: 'Organization',

  head () {
    return { title: 'Organization' }
  },

  middleware: 'authenticated',

  mixins: [routeMixin],

  components: {
    CreateFunnelModal
  },

  computed: {
    ...mapState(['user']),

    organization () {
      return this.user && this.user.organization
    }
  },

  methods: {
    formatSLA (sla) {
      return moment.duration(sla, 'seconds').humanize()
    }
  }
}
</script>

<template>
  <v-layout column v-if="organization">
    <v-flex xs12 sm6>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm6 md3 v-for="funnel in organization.funnels" :key="funnel.slug" >
            <v-card hover :to="funnelRoute(funnel.slug)">
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{ funnel.jobTitle }}</div>
                </div>
              </v-card-title>
              <v-card-text>
                <div>{{ funnel.description }}</div>
                <div class="grey--text"># Candidates: {{ funnel.candidates.length }}</div>
                <div class="grey--text">SLA: {{ formatSLA(funnel.sla) }}</div>
              </v-card-text>
            </v-card>
          </v-flex>
            <create-funnel-modal :user="user"/>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
