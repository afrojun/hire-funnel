<script>
export default {
  data () {
    return {
      dialog: false
    }
  }
}
</script>

<template>
  <v-dialog v-model="dialog" persistent max-width="500">
    <v-btn large color="green" dark slot="activator">Supercharge your hiring plan!</v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">Your Organization</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="Name" required />
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Website" required />
            </v-flex>
            <v-flex xs12>
              <v-select
                label="Number of Employees"
                required
                :items="['1-10', '11-50', '50-500', '500-2000', '2000+']"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" flat @click.native="dialog = false">Cancel</v-btn>
        <v-btn color="green" flat @click.native="dialog = false">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
