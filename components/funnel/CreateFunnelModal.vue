<script>
import shortid from 'shortid'
import slugify from '~/utils/slugify'

import { CreateFunnel } from '~/graphql/funnels'
import { UserQuery } from '~/graphql/users'

import FunnelForm from '~/components/funnel/FunnelForm'

export default {
  props: {
    user: {
      required: true,
      type: Object
    }
  },

  components: {
    FunnelForm
  },

  data () {
    return {
      dialog: false,
      slugSuffix: shortid.generate()
    }
  },

  computed: {
    slug () {
      return `${slugify(this.jobTitle)}-${this.slugSuffix}`
    }
  },

  methods: {
    closeModal () {
      this.dialog = false
    },

    async createFunnel (formVars) {
      try {
        const userId = this.user.id
        await this.$apollo.mutate({
          mutation: CreateFunnel,
          variables: {
            slug: this.slug,
            organizationId: this.user.organization.id,
            ...formVars
          },
          update (store, { data: { createFunnel } }) {
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            data.user.organization.funnels.push(createFunnel)

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
      large
      color="purple"
      dark
      slot="activator">
      Add funnel
    </v-btn>
    <funnel-form
      :user="user"
      headline="Create a Funnel"
      :submitFn="createFunnel"
      :cancelFn="closeModal"
      submitText="Create"/>

  </v-dialog>
</template>
