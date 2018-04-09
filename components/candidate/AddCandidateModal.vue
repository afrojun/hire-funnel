<script>
import { CreateCandidate } from '~/graphql/candidates'
import { UserQuery } from '~/graphql/users'

import CandidateForm from '~/components/candidate/CandidateForm'

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
    CandidateForm
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

    async createCandidate (candidateVars) {
      try {
        const funnelId = this.funnel.id
        const userId = this.user.id

        await this.$apollo.mutate({
          mutation: CreateCandidate,
          variables: {
            funnelId: this.funnel.id,
            stageId: this.funnel.stages[0].id,
            ...candidateVars
          },
          update (store, { data: { createCandidate } }) {
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            const funnel = data.user.organization.funnels.find(funnel => funnel.id === funnelId)
            funnel.candidates.push(createCandidate)
            funnel.stages[0].candidates.push(createCandidate)

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
  <v-dialog v-model="dialog" persistent max-width="500">
    <v-btn
      color="green"
      dark
      slot="activator">
      Add Candidate
    </v-btn>
    <candidate-form
      :user="user"
      :funnelId="funnel.id"
      :submitFn="createCandidate"
      submitText="Create"
      headline="Create Candidate"
      :cancelFn="closeModal" />
  </v-dialog>
</template>
