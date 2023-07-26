<template>
    <div class="flex align-items-center mb-3">
        <i class="pi pi-calendar text-blue-500 text-xl mr-2 text-left">
        </i>
        <span class="text-500 font-medium">Sessions</span>
    </div>
    <span class="block text-900 font-medium mb-4 text-xl" v-if="upcomingNum">{{upcomingNum}} Upcoming</span>
    <span class="block text-900 font-medium mb-4 text-xl" v-else>0 Upcoming</span>
    <div class="flex align-items-center">
        <i class="pi pi-check-square text-green-500 text-xl mr-2 text-left"></i>
        <span class="text-green-500 font-medium" v-if="completedNum">{{completedNum}}</span>
        <span class="text-green-500 font-medium" v-else>0</span>
        <span class="ml-2">Completed</span>
    </div>
</template>

<script>

import axios from 'axios'
import moment from 'moment'

export default {

    data(){
        return{
            userId: String,
            arrSessions:[],
            upcomingNum: String,
            completedNum: String,
            token: localStorage.getItem('auth')
        }
    },
    mounted(){
        let userData = JSON.parse(localStorage.getItem('myData'));
        this.userId = userData.id;

        if(userData.role.name == 'Coach' || userData.role.name == 'Client Portal'){
            this.getProjectCodes();
           
        }
    },
    methods:{
        async getProjectCodes(){
            
            axios.get('/items/projectCodes',{
                params:{
                    access_token: this.token
                }
            }).then((resp)=>{
                if(resp.status == 200){
                    let projectCodes = resp.data.data.map((item)=> item.id);
                    this.getSessions(projectCodes);
                }   
            })

        },
        async getSessions(projectCodes){
            
            axios.get('/items/appointments',{
                params:{
                    access_token: this.token,
                    fields:"*",
                    filter:{
                        project_code: {_in: projectCodes.join(",")},
                        status:{_eq: "confirmed"}
                    },
                    limit: '-1'
                },
                
            }).then((resp)=>{
                if(resp.status == 200){
                    this.arrSessions = resp.data.data;
                }
            })
        }
    },
    watch:{
        arrSessions: function(d){
            let currDate = moment(new Date());

            let upcoming = d.filter(function(item){
                return item.status == 'confirmed' && item.session_status =='pending'  ;
            });
            this.upcomingNum = upcoming.length;


            let completed = d.filter(function(item){
                return item.status == 'confirmed' && item.session_status =='ended';
            });
            this.completedNum = completed.length;
        }
    }

}
</script>

<style>

</style>