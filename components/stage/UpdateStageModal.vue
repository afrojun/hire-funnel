<script>
import { UpdateStage } from '~/graphql/stages'
import { UserQuery } from '~/graphql/users'

import StageForm from '~/components/stage/StageForm'

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

  components: {
    StageForm
  },

  data () {
    return {
      dialog: false
    }
  },

  methods: {
    closeModal () {
      this.dialog = false
    },

    async updateStage (stageVars) {
      try {
        const funnelId = this.funnelId
        const stageId = this.stage.id
        const userId = this.user.id

        await this.$apollo.mutate({
          mutation: UpdateStage,
          variables: {
            id: this.stage.id,
            ...stageVars
          },
          update (store, { data: { updateStage } }) {
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            const funnel = data.user.organization.funnels.find(funnel => funnel.id === funnelId)
            funnel.stages = funnel.stages.map(stage => {
              return stage.id === stageId ? updateStage : stage
            })

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
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-list-tile-title
      slot="activator">
      Update
    </v-list-tile-title>
    <stage-form
      :user="user"
      :stage="stage"
      :submitFn="updateStage"
      submitText="Update"
      headline="Update Stage"
      :cancelFn="closeModal" />
  </v-dialog>
</template>
