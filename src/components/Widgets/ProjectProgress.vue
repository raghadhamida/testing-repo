<template>

        <div class="flex align-items-center mb-4">
        <i class="pi pi-chart-pie text-green-500 text-xl mr-2"></i
        ><span class="text-500 font-medium">Journey Progress</span>
        </div>
    <div class="flex justify-content-between align-items-center">
        <span class="text-800">Coaching Sessions Progress</span
        ><span class="text-900 font-medium"
            >{{ progress_percentage }}%</span
        >
        </div>
        <div
        class="surface-300 mt-2 mb-3 border-round"
        style="height: 7px"
        >
        <div
            class="bg-green-500 h-full border-round"
            :style="`width:${progress_percentage}%`"
        ></div>
        </div>
        <div class="flex justify-content-between align-items-center">
        <span class="text-900">
            {{totalDone}} / {{totalProg}} Coaching Sessions
        </span>
        </div>
            
</template>

<script>

import axios from "axios";
// import {storeAuth} from '../HelloClient.vue'

export default {

    data(){
        return{
            progress_percentage: 0,
            token: localStorage.getItem('auth'),
            userId: JSON.parse(localStorage.getItem('myData')).id, 
            totalSess: 0,
            totalCoachee: 0,
            totalProg: 0,
            totalDone: 0,
            sessionsArr:[]
        }
    },
    mounted(){

        this.getSessTotal();

    },
    methods:{
        async getSessTotal(){
            axios.get('/items/customerTimeline',{
            params:{
                fields: "*,step.project_code.project_code, step.project_code.id",
                access_token: this.token,
                filter:{ 
                    has_coaching:{_eq: true}
                }
            }}).then((resp)=>{
                if(resp.status == 200){
                    this.sessionsArr = resp.data.data
                    this.totalSess = resp.data.data.length;
                    this.getCoachees();
                }
            })
        },
        async getCoachees(){
            axios.get("/items/customerTimelineClients", {
            params: {
                fields: "*,coachees",
                access_token: this.token
            }
            }).then((resp)=>{
                if(resp.status == 200 ){
                    let coacheeResp = resp.data.data;
                    let coacheeTotal = 0;


                    coacheeResp.forEach(item => {
                        let filterSess = this.filterArr(this.sessionsArr, item.project_code);
                        coacheeTotal = coacheeTotal + (item.coachees.length * filterSess.length);
                    });
                    this.totalCoachee = coacheeTotal;
                    this.totalProg = coacheeTotal;
                    this.getDone();
                }
            })
        },
        async getDone(){
            axios.get('/items/appointments',{
                params:{
                    fields: "*",
                    access_token: this.token,
                    filter:{ 
                    status:{_eq:'confirmed'},
                    session_status:{_eq:'ended'},
                    coachee:{_nnull: true}
                    },
                    limit:"-1"

                }
            }).then((resp)=>{
                if(resp.status == 200){
                    this.totalDone = resp.data.data.length;
                    this.progress_percentage = Math.trunc((this.totalDone / this.totalProg) * 100) ? 
                    Math.trunc((this.totalDone / this.totalProg) * 100): 0;
                }
            })
        },
        filterArr(sessArr, projectCode){
            return sessArr.filter( filterItem => filterItem.step.project_code.id === projectCode);
                
        }
    }

}
</script>

<style>

</style>