<template>
  <div class="flex align-items-center mb-3">
    <i class="pi pi-users text-cyan-500 text-xl mr-2"></i>
    <span class="text-500 font-medium">Employees</span>
  </div>
  <span
    class="text-900 font-medium text-5xl" >
    {{ finalData.length }}
    </span>
  <div class="flex align-items-center">
    <a class="no-underline mt-2 cursor-pointer" @click="showCoachees">
      <span class="text-cyan-500 font-medium">View All Employees</span>
      <i class="pi pi-arrow-right text-cyan-500 text-sm ml-2"></i>
    </a>
  </div>

  <Sidebar
    v-model:visible="displaySidebar"
    :baseZIndex="10000"
    position="right"
    class="large-sidebar w-12 md:w-10"
    :class="{ blurred: viewingProfile }"
  >
    <template #header>
      <div class="flex align-items-start justify-items-start">
        <div>
          <div
            class="text-900 font-medium text-lg md:text-3xl flex align-items-center gap-2"
          >
            <span>Employees</span>
            
            <span class="text-800 text-sm bg-bluegray-100 px-2 py-1 border-round">
              <span v-if="filteredData.length >= 1">{{ filteredData.length }}/</span>
              <span>{{ finalData.length }}</span>
            </span
            >
          </div>
        </div>
        <div class="coachee-admin-tools align-items-center flex ml-3">
          <SearchCoachees
            v-if="dataLoaded"
            :data="finalData"
            @resetFilteredData="filteredData = []"
            @filteredCoacheesData="filteredData = $event.filteredCoachees"
            class="p-input-filled"
          />
        </div>
      </div>
    </template>
    <DataTable v-if="dataLoaded" 
     :value="filteredData.length >= 1 ? filteredData : finalData"
     class="p-datatable">
      <Column
        header="Username"
        headerStyle="width:4rem"
        headerClass="text-sm"
      >
        <template #body="slotProps">
          <a class="cursor-pointer" @click="viewingProfile = slotProps.data">
            <i class="pi pi-user mr-2 text-sm"></i>
            <!-- <span class="text-sm" v-if="!slotProps.data.tokenize"
              >{{ slotProps.data.first_name }}
              {{ slotProps.data.last_name }}</span
            >
            <span class="text-sm" v-else
              >{{ slotProps.data.email.split("@")[0] }}
            </span> -->
            <span class="text-sm" v-if="!slotProps.data.token">
              {{ slotProps.data.coacheeName }}
            </span>
            <span class="text-sm" v-if="slotProps.data.token">
              {{ slotProps.data.coacheeTokenized }}
            </span>
          </a>
        </template>
      </Column>
      <Column
        header="Assigned Coach"
        headerStyle="width:2rem"
        headerClass="text-sm"
      >
        <template #body="slotProps">
          <span class="text-sm">{{ slotProps.data.coachName }}</span>
        </template>
      </Column>
      <Column
        header="Completed Sessions"
        headerStyle="width:2rem"
        headerClass="text-sm"
      >
        <template #body="slotProps">
          <span
            v-if="slotProps.data.allSteps"
            class="border-round-3xl py-1 px-3 bg-blue-100 text-blue-800 text-xs font-medium uppercase"
            >{{ slotProps.data.completedSteps }} /
            {{ slotProps.data.allSteps }}</span
          >
          <span
            v-else
            class="border-round-3xl py-1 px-3 bg-orange-100 text-orange-800 text-xs font-medium uppercase"
            >Pending</span
          >
        </template>
      </Column>
      <Column header="Project" headerStyle="width:2rem" headerClass="text-sm">
        <template #body="slotProps">
          <span class="border-round-3xl py-1 px-3 bg-green-100 text-green-800 text-xs font-medium uppercase">
            {{ slotProps.data.project }}
            </span>
        </template>
      </Column>
      <Column header="Progress" headerClass="text-sm" headerStyle="width:4rem">
        <template #body="slotProps">
          <ProgressBar
            :value="
              getProjectProgress(
                slotProps.data.completedSteps,
                slotProps.data.allSteps
              )
            "
            class="text-xs border-round-3xl bg-gray-100"
          />
        </template>
      </Column>
    </DataTable>
  </Sidebar>

    <Sidebar
    v-model:visible="viewingProfile"
    :baseZIndex="10000"
    position="right"
    class="large-sidebar w-12 md:w-8"
  >
    <template #header>
      <div class="flex align-items-start justify-items-start">
        <div>
          <div
            class="text-900 font-medium text-lg md:text-3xl flex align-items-center gap-2"
          >
            <span v-if="!viewingProfile.token">
              {{ viewingProfile.coacheeName }}
            </span>
            <span v-if="viewingProfile.token">
              {{ viewingProfile.coacheeTokenized }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <coacheeProfile
      :coacheeId="viewingProfile.coachee"
      :coacheeData="viewingProfile"
      @newCoachAssignment="newCoachAssignment($event)"
    />
  </Sidebar>
</template>


<script>
import axios from "axios";
import Sidebar from "primevue/sidebar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ProgressBar from "primevue/progressbar";
import coacheeProfile from './Coachee/CoacheeProfile.vue'
// import changePasswordVue from '../MainFunctionalities/changePassword.vue';
import SearchCoachees from './Search/SearchCoachees.vue'
import SplitButton from 'primevue/splitbutton';

export default {
  data() {
    return {
      token: localStorage.getItem("auth"),
      coacheesIDs:[],
      allCoachees:[],
      finalData:[],
       filteredData: [],
      coacheeNum: Number,
      displaySidebar: false,
      dataLoaded: false,
      viewingProfile: false,
      projectsIDs:[]
    };
  },
  components: {
    Sidebar,
    DataTable,
    Column,
    ProgressBar,
    coacheeProfile,
    SearchCoachees,
    SplitButton
  },
  mounted() {
    this.getProjectAssign();
  },
  methods: {
    async getProjectAssign(){

      axios
        .get("/items/customerTimelineClients", {
          params: {
            fields:
              "*,project_code.title,project_code.id,coachees.directus_users_id.id,coachees.directus_users_id.first_name,coachees.directus_users_id.last_name",
            access_token: this.token,
            
          },
        }).then((resp)=>{
          if(resp.status == 200){

            console.log('ALL', resp.data.data)

            this.projectsIDs = resp.data.data.map((item)=> item.project_code.id);
            
            let firstData = resp.data.data.map((item) => item.coachees.map((coachee) => coachee.directus_users_id.id));

            let secondData = resp.data.data.map((item) => {
              return{
                coachee: Array.prototype.concat.apply([], item.coachees.map((coachee) => coachee.directus_users_id.id)),
                project: item.project_code.title,
                projectID: item.project_code.id
              }
            });

            let thirdData = Array.prototype.concat.apply([], firstData);

            this.finalData = thirdData.map((item) => {
              return{
                coachee: item,
                project: secondData.filter((test) => test.coachee.includes(item)) ? secondData.filter((test) => test.coachee.includes(item))[0].project : false,
                projectID: secondData.filter((test) => test.coachee.includes(item)) ? secondData.filter((test) => test.coachee.includes(item))[0].projectID : false,
              }
            });
            this.getCoachAssign();
          }
        })
    },
     async getCoachAssign(){

      let coachees_ids = this.finalData.map((item)=> item.coachee);

      axios
        .get("/items/assignments", {
          params: {
            fields:
              "*,coach.fullname,coach.coach_id.id,coachee_id.id,coachee_id.first_name,coachee_id.last_name",
            access_token: this.token,
            filter: {
              coachee_id:{ id:{ _in: coachees_ids} },
              coachee_id: {id:{_nnull: true}},
              coach: { coach_id:{ _nnull: true }}
            },
          },
        }).then((resp)=>{
          if(resp.status == 200){

            this.finalData = this.finalData.map(({coachee,...rest})=>({
              coachee,...rest,
              coachName: resp.data.data.filter((d)=> d.coachee_id.id == coachee)[0] ?
                         resp.data.data.filter((d)=> d.coachee_id.id == coachee)[0].coach.fullname : 'Not Assigned',
              coachId: resp.data.data.filter((d)=> d.coachee_id.id == coachee)[0] ?
                       resp.data.data.filter((d)=> d.coachee_id.id == coachee)[0].coach.coach_id.id : false

            }));
            this.getProjectSteps();
          }
        })
    },
    async getProjectSteps(){

      // let projectsIDs = this.finalData.map((item)=> item.projectID).filter((project) => project != false);
      // console.log(this.projectsIDs);

      axios
        .get("/items/customerTimeline",{
          params: {
            fields: "*,step.project_code.id",
            access_token: this.token,
            filter: {
              step: {
                project_code:{id:{_in: this.projectsIDs.join(',')}},
              },
              has_coaching: { _eq: "true" },
            },
          },
        }).then((resp)=>{
          if(resp.status == 200){
            this.finalData = this.finalData.map(({projectID,...rest}) => ({
              projectID, ...rest,
              allSteps: resp.data.data.filter((respD) => respD.step.project_code.id == projectID).length
            }));
            this.getCompletedSteps();
          }
        })
    },
    async getCompletedSteps(){
      let coacheesData = this.allCoachees.map((item)=> item.id);
      axios
        .get("/items/coachee_latest", {
          params: {
            fields: "*,step.id,coachee.id,coachee.first_name,coachee.last_name,step.sort",
            access_token: this.token,
            filter: {coachee:{id:{ _in: coacheesData}}},
          },
        }).then((resp)=>{
          if(resp.status == 200){

            this.finalData = this.finalData.map(({coachee,...rest}) => ({
              coachee, ...rest,
              completedSteps: resp.data.data.filter((respD) => respD.coachee.id == coachee)[0] ?
                              resp.data.data.filter((respD) => respD.coachee.id == coachee)[0].last_session == 'true' ?
                              resp.data.data.filter((respD) => respD.coachee.id == coachee)[0].step.sort :
                              resp.data.data.filter((respD) => respD.coachee.id == coachee)[0].step.sort - 1 : 0
            }));
            this.getCoacheesData();
            // this.dataLoaded = true;
          }
        })
    },
    async getCoacheesData(){
      let coachees = this.finalData.map((item)=> item.coachee);

      axios.get("/users", {
        params: {
          fields:"*",
          access_token: this.token,
          filter: {
            id:{_in: coachees.join(',') },
            role: {
              _eq: "31e25a6a-3564-4625-a83f-c14efc162e21",
            },
          }, 
        }
      }).then((resp)=>{
        if(resp.status == 200){
          let tokenizedUsers = resp.data.data.filter((item) => item.tokenize == true);
          

          if(tokenizedUsers.length > 0){

            this.finalData = this.finalData.map(({coachee,...rest})=>({
              coachee,...rest,
              token: resp.data.data.filter((respD)=> respD.id == coachee)[0].data_token ? 
              resp.data.data.filter((respD)=> respD.id == coachee)[0].data_token : false,
              coacheeName: resp.data.data.filter((respD)=> respD.id == coachee)[0] ?
              resp.data.data.filter((respD)=> respD.id == coachee)[0].first_name +' '+ resp.data.data.filter((respD)=> respD.id == coachee)[0].last_name : ' '
            }));
            this.decryptUsers(tokenizedUsers);

          }
          else{
            this.finalData = this.finalData.map(({coachee,...rest})=>({
            coachee,...rest,
            coacheeName: resp.data.data.filter((respD)=> respD.id == coachee)[0] ?
              resp.data.data.filter((respD)=> respD.id == coachee)[0].first_name +' '+ resp.data.data.filter((respD)=> respD.id == coachee)[0].last_name : ' '
            }));
          }
        }
      })
    },
    async decryptUsers(tokenizedUsers){
      
      let dataTokens = tokenizedUsers.map((item)=> item.data_token);

      const config = {
        headers: { Authorization: `Bearer ${this.token}` },
      };
      axios.post(
        "/reachify/batch/",
        {
          tokens: dataTokens,
        },
        config
      ).then((resp)=>{
        if(resp.status == 200){
          this.finalData = this.finalData.map(({token,...rest})=>({
            token,...rest,
            coacheeTokenized: resp.data.filter((respD)=> respD.token == token)[0] ?
              resp.data.filter((respD)=> respD.token == token)[0].name : ' '
            }));
          this.dataLoaded = true;  
        }
      })
    },
    showCoachees(){
      this.displaySidebar = true;
    },
    getProjectProgress(completedSteps, allSteps){
      return Math.round((completedSteps / allSteps)*100);
    },
  },
};
</script>

<style>
.p-timeline-event {
  min-height: 40px;
}
.p-timeline-left .p-timeline-event-opposite {
  display: none !important;
}
</style>