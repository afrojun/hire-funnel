<script>
import { mapState, mapMutations } from 'vuex'
import routeMixin from '~/mixins/routeMixin'
import { webAuth, getUserIdFromLocalStorage } from '~/utils/auth'
import { UserQuery } from '~/graphql/users'
import EventBus from '~/utils/eventBus'

export default {
  data () {
    return {
      userId: null
    }
  },

  mixins: [routeMixin],

  mounted () {
    if (!this.userId) {
      this.userId = getUserIdFromLocalStorage()
    }

    EventBus.$on('FetchUser', ({ id }) => {
      this.userId = id
    })
    /* this.setOrganization({
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
    }) */
  },

  computed: {
    ...mapState(['user'])
  },

  methods: {
    ...mapMutations(['setUser']),

    authenticateUser () {
      webAuth().authorize()
    }
  },

  apollo: {
    graphqlUser: {
      query: UserQuery,
      variables () {
        return {
          id: this.userId
        }
      },
      skip () {
        return !this.userId
      },
      update (data) {
        this.setUser({ user: data.user })
      }
    }
  }
}
</script>

<template>
  <v-app light>
    <v-toolbar fixed app>
      <v-btn flat @click="$router.push(primaryNavRoute)">
        H<v-icon x-large class="flip-vertical" color="purple">merge_type</v-icon>F
      </v-btn>
      <v-spacer />
      <span v-if="user">
        <span class="username hidden-xs-only">
          {{ `${user.firstName[0]}. ${user.lastName}` }}
        </span>
        <v-btn icon @click="$router.push(userRoute)">
          <v-icon medium>face</v-icon>
        </v-btn>
        <v-btn icon @click="$router.push(logoutRoute)">
          <v-icon medium>exit_to_app</v-icon>
        </v-btn>
      </span>
      <v-btn icon v-else @click="authenticateUser">
        <v-icon>lock</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
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
