<script>
import { UpdateStage } from '~/graphql/stages'
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
    }
  },

  methods: {
    async updateStage () {
      try {
        const funnelId = this.funnelId
        const stageId = this.stage.id
        const userId = this.user.id

        await this.$apollo.mutate({
          mutation: UpdateStage,
          variables: {
            id: this.stage.id,
            name: this.name,
            description: this.description,
            sla: this.sla,
            advancePolicy: this.advancePolicy
          },
          update (store, { data: { updateStage } }) {
            console.log(updateStage)
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            console.log(data)
            const funnel = data.user.organization.funnels.find(funnel => funnel.id === funnelId)
            console.log(funnel)
            funnel.stages = funnel.stages.map(stage => {
              return stage.id === stageId ? updateStage : stage
            })
            console.log(funnel)

            store.writeQuery({
              query: UserQuery,
              variables: { id: userId },
              data
            })
          }
        })

        console.log('updated stage')
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
      small
      color="teal"
      dark
      slot="activator">
      Update Stage
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">Update Stage</span>
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
        <v-btn color="grey darken-1" flat @click.native="dialog = false">Cancel</v-btn>
        <v-btn color="green" flat @click.native="updateStage">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
