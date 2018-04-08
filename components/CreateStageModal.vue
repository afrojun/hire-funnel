<script>
import { CreateStage } from '~/graphql/stages'
import { UserQuery } from '~/graphql/users'

import StageForm from '~/components/StageForm'

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    funnel: {
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

  computed: {
    nextIndex () {
      return this.funnel.stages.length
    }
  },

  methods: {
    closeModal () {
      this.dialog = false
    },

    async createStage (stageVars) {
      try {
        const funnelId = this.funnel.id
        const userId = this.user.id

        await this.$apollo.mutate({
          mutation: CreateStage,
          variables: {
            funnelId: this.funnel.id,
            index: this.nextIndex,
            ...stageVars
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
      color="purple"
      dark
      slot="activator">
      Create Stage
    </v-btn>
    <stage-form
      :user="user"
      :funnelId="funnel.id"
      :submitFn="createStage"
      submitText="Create"
      headline="Create Stage"
      :cancelFn="closeModal" />
  </v-dialog>
</template>
