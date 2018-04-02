<script>
import moment from 'moment'
import { mapState } from 'vuex'
import routeMixin from '~/lib/routeMixin'

export default {
  name: 'Organization',

  head () {
    return { title: 'Organization' }
  },

  middleware: 'authenticated',

  computed: {
    ...mapState(['user', 'organization'])
  },

  methods: {
    formatSLA (sla) {
      return moment.duration(sla, 'seconds').humanize()
    }
  },

  updated () {
    console.log(this.$route.name)
  },

  mixins: [routeMixin]
}
</script>

<template>
  <v-layout column v-if="organization && isOrgIndexRoute">
    <v-flex xs12 sm6>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm6 md3
            v-for="funnel in organization.funnels" :key="funnel.slug">
            <v-card hover :to="funnelRoute(funnel.slug)">
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{ funnel.jobTitle }}</div>
                  <div>{{ funnel.description }}</div>
                  <div class="grey--text"># Candidates: {{ funnel.candidates.length }}</div>
                  <div class="grey--text">SLA: {{ formatSLA(funnel.sla) }}</div>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
