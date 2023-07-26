<template>

    <h2 class="mt-6">
    <i class="pi pi-sitemap text-xl mr-2 text-left"></i>
    Project Journey
  </h2>
  <div class="grid">
    <div class="col-12 lg:col-7">
      <div class="surface-card border-round shadow-2 p-2 md:p-4">
        <div class="text-900 font-semibold mb-4 text-xl text-center md:text-left">
          Timeline
        </div>

        <div class="card">
            <TabView class="tabview-custom" ref="tabview4">
                <TabPanel v-for="(item, i) of projects" :key="i" class="outline-none">
                    <template #header>
                        <i class="pi pi-folder-open mr-1"></i>
                        <span>{{item.project_code.title}}</span>
                    </template>
                    <projectTimeline :projectCode="item.project_code.project_code" :projectName="item.project_code.title" />
                </TabPanel>
            </TabView>
        </div>        



    </div>
    </div>
        <clientUpcoming />
    </div>     
  
</template>

<script>

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import clientUpcoming from './ClientUpcoming.vue'
import projectTimeline from './ClientEngagements.vue'
import axios from "axios";

export default {

    components:{
        TabView,
        TabPanel,
        clientUpcoming,
        projectTimeline
    },
    data(){
        return{
            token: localStorage.getItem("auth"),
            projects: []
        }
    },
    mounted(){
        this.getClientProjects();
    },
    methods:{
        async getClientProjects(){
            axios.get("/items/customerTimelineClients", {
                params: {
                fields: "*, project_code.title, project_code.project_code",
                access_token: this.token,
                },
            }).then((resp)=>{
                if(resp.status == 200){
                    this.projects = resp.data.data;
                }
            });
        }
    }


}
</script>

<style>

</style>