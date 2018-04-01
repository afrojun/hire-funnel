<script>
import { mapState, mapMutations } from 'vuex'
import routeMixin from '~/lib/routeMixin'

export default {
  mixins: [routeMixin],

  mounted () {
    console.log(this.user)
    this.setUser({
      id: 'user-1',
      slug: 'arjun',
      firstName: 'Arjun',
      lastName: 'Radhakrishnan',
      nickname: 'afrojun',
      email: 'admin@hirefunnel.co',
      auth0UserId: 'auth0-id-1'
    })
    this.setOrganization({
      id: 'org-1',
      slug: 'rosterpocalypse',
      name: 'Rosterpocalypse',
      website: 'https://www.rosterpocalypse.com',
      funnels: [
        {
          slug: 'funnel-1',
          jobTitle: 'Nurse',
          description: 'Find a nurse',
          sla: 1209600,
          candidates: [{ id: 'can-1' }, { id: 'can-2' }]
        },
        {
          slug: 'funnel-2',
          jobTitle: 'Doctor',
          description: 'Need a doctor, stat!',
          sla: 1209600,
          candidates: [{ id: 'can-3' }, { id: 'can-4' }]
        }
      ]
    })
  },

  updated () {
    console.log(this.$route.name)
  },

  computed: {
    ...mapState(['user', 'organization'])
  },

  methods: {
    ...mapMutations(['setUser', 'setOrganization']),

    authenticateUser () {
      console.log('authenticateUser')
    }
  }
}
</script>

<template>
  <v-app light>
    <v-toolbar fixed app>
      <v-btn flat @click.prevent="$router.push(primaryNavRoute)">
        H<v-icon x-large class="flip-vertical" color="purple">merge_type</v-icon>F
      </v-btn>
      <v-spacer />
      <span v-if="user">
        <span class="username">
          {{ `${user.firstName[0]}. ${user.lastName}` }}
        </span>
        <v-btn icon @click.prevent="$router.push(userRoute)">
          <v-icon medium>face</v-icon>
        </v-btn>
      </span>
      <v-btn icon v-else @click="authenticateUser">
        <v-icon>lock</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer fixed app>
      <v-spacer />
      <span>&copy; 2018 Hire Funnel</span>
      <v-spacer />
    </v-footer>
  </v-app>
</template>

<style scoped>
.username {
  font-size: large;
  font-weight: 400;
}

.flip-vertical {
  transform: rotate(180deg);
}
</style>
