<script>
import moment from 'moment'

import { UpdateCandidate } from '~/graphql/candidates'
import { UserQuery } from '~/graphql/users'

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    funnelId: {
      type: String,
      required: true
    },
    stage: {
      type: Object,
      required: true
    },
    candidate: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      dialog: false,
      dateModal: false,
      timeModal: false,
      date: null,
      time: null,
      location: 'here and now',
      interviewers: null
    }
  },

  computed: {
    dateTime () {
      if (this.date && this.time) {
        return moment(`${this.date} ${this.time}`).toISOString()
      }
    }
  },

  methods: {
    closeModal () {
      this.dialog = false
    },

    async scheduleInterview () {
      try {
        // const funnelId = this.funnelId
        // const stageId = this.stage.id
        const userId = this.user.id

        await this.$apollo.mutate({
          mutation: UpdateCandidate,
          variables: {
            id: this.candidate.id,
            interviews: [{
              stageId: this.stage.id,
              date: this.dateTime,
              location: this.location
            }]
          },
          update (store, { data: { updateCandidate } }) {
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            // const funnel = data.user.organization.funnels.find(funnel => funnel.id === funnelId)
            // funnel.stages[0].candidates.push(createCandidate)
            console.log(updateCandidate)

            store.writeQuery({
              query: UserQuery,
              variables: { id: userId },
              data
            })
          }
        })

        this.dialog = false
      } catch (error) {
        console.error(error)
      }
    }
  },

  updated () {
    console.log(this.date)
    console.log(this.time)
    console.log(this.dateTime)
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-btn icon small
      slot="activator">
      <v-icon>event</v-icon>
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">Schedule Interview</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 md6 sm4>
              <v-dialog
                ref="dateDialog"
                persistent
                v-model="dateModal"
                lazy
                full-width
                width="290px"
                :return-value.sync="date">
                <v-text-field
                  slot="activator"
                  label="Picker in dialog"
                  v-model="date"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="date" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="dateModal = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.dateDialog.save(date)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-flex>
            <v-flex xs12 md6 sm4>
              <v-dialog
                ref="timeDialog"
                persistent
                v-model="timeModal"
                lazy
                full-width
                width="290px"
                :return-value.sync="time"
              >
                <v-text-field
                  slot="activator"
                  label="Picker in dialog"
                  v-model="time"
                  prepend-icon="access_time"
                  readonly
                ></v-text-field>
                <v-time-picker v-model="time" actions>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="timeModal = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.timeDialog.save(time)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" flat @click.native="dialog = false">Cancel</v-btn>
        <v-btn color="green" flat @click.native="scheduleInterview">Schedule</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
