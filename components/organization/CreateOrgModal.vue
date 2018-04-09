<script>
import shortid from 'shortid'
import { CreateOrganization } from '~/graphql/organizations'
import { UserQuery } from '~/graphql/users'
import slugify from '~/utils/slugify'

export default {
  props: {
    user: {
      required: true,
      type: Object
    }
  },

  data () {
    return {
      dialog: false,
      name: null,
      website: null,
      slugSuffix: shortid.generate()
    }
  },

  computed: {
    slug () {
      return `${slugify(this.name)}-${this.slugSuffix}`
    }
  },

  methods: {
    async createOrganization () {
      try {
        const userId = this.user.id
        await this.$apollo.mutate({
          mutation: CreateOrganization,
          variables: {
            name: this.name,
            slug: this.slug,
            website: this.website,
            usersIds: [userId]
          },
          update (store, { data: { createOrganization } }) {
            const data = store.readQuery({
              query: UserQuery,
              variables: { id: userId }
            })

            data.user.organization = createOrganization

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
      large
      color="green"
      dark
      slot="activator">
      Supercharge your hiring plan!
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">Your Organization</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field v-model="name" label="Name" required />
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="website" label="Website" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" flat @click.native="dialog = false">Cancel</v-btn>
        <v-btn color="green" flat @click.native="createOrganization">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
