<template>
      <div class="grid">
        <div class="col-12">
          <div class="surface-card shadow-2 border-round flex p-3 flex-column md:flex-row">

          <div class="border-bottom-1 md:border-right-1 md:border-bottom-none surface-border flex-auto p-3">
            <nextSession />
          </div>

          <div class="border-bottom-1 md:border-right-1 md:border-bottom-none surface-border flex-auto p-3">
            <sessions />
          </div>
          <div class="border-bottom-1 md:border-right-1 md:border-bottom-none surface-border flex-auto p-3">
            <coachees />
          </div>
          <div class="border-bottom-1 md:border-bottom-none surface-border flex-auto p-3 align-items-center text-center">
            <projectProgress />
          </div>  
        </div>
      </div>
    </div>
</template>

<script>

//import axios from 'axios'
import sessions from './SessionsWidget.vue'
import nextSession from './NextSessionWidget.vue'
import projectProgress from './ProjectProgress.vue'
import coachees from './CoacheeWidget.vue'

export default {
    components:{
      sessions,
      nextSession,
      projectProgress,
      coachees
    },
    props:{
      userId: String,
      coach: Boolean,
      coachee: Boolean,
      client:Boolean,
      cradmin: Boolean
    },
    data(){
      return{
        onlineSessions: String,
        onsiteSessions: String,
        coacheeNum: String,
        coachSlots:[]
      }
    },
    methods:{
      async callCoachID(){
        let token = localStorage.getItem('auth');
        const config = {
        headers: { Authorization: `Bearer ${token}` }
        };
        let filter = {
          coach_id:{"_eq": this.userId}
        };
        return axios.get('/items/coaches?filter=' + JSON.stringify(filter), config );

      }
    }


}
</script>

<style>

</style>