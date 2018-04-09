<script>
import { UpdateFunnel } from '~/graphql/funnels'
import { UserQuery } from '~/graphql/users'

import FunnelForm from '~/components/funnel/FunnelForm'

export default {
  props: {
    user: {
      required: true,
      type: Object
    },
    funnel: {
      required: true,
      type: Object
    }
  },

  components: {
    FunnelForm
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

    async updateFunnel (formVars) {
      try {
        const userId = this.user.id

        await this.$apollo.mutate({
          mutation: UpdateFunnel,
          variables: {
            id: this.funnel.id,
            ...formVars
          },
          update (store, { data: { updateFunnel } }) {
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            data.user.organization.funnels = data.user.organization.funnels.map(funnel => {
              return funnel.id === updateFunnel.id ? updateFunnel : funnel
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
    <v-btn
      icon small dark color="green lighten-2"
      slot="activator">
      <v-icon>edit</v-icon>
    </v-btn>
    <funnel-form
      :user="user"
      :funnel="funnel"
      headline="Update a Funnel"
      :submitFn="updateFunnel"
      :cancelFn="closeModal"
      submitText="Update"/>

  </v-dialog>
</template>
