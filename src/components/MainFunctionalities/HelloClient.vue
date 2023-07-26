<template>

  <div v-if="check">
    
    <AuthRefresh />

    <Sidebar
      v-model:visible="showPass"
      :baseZIndex="10000"
      position="right"
      class="large-sidebar w-12 md:w-6 min-w-6"
    >
      <template #header>
        <div class="flex align-items-start justify-items-start">
          <div>
            <div
              class="
                text-900
                font-medium
                text-lg
                md:text-3xl
                flex
                align-items-center
                gap-2
                justify-content-start
              "
            >
              <span>Change Password</span>
              <span></span>
            </div>
          </div>
        </div>
      </template>
      <changePassword />
    </Sidebar>

    <div class="p-2 md:p-5 flex flex-column flex-auto">

        <div class="flex align-items-center justify-content-between">
          <h1>{{ msg }}</h1>

          <div class="user-summary flex align-items-center justify-content-end cursor-pointer"
          @click="toggleUserMenu($event)"
              aria-haspopup="true"
              aria-controls="overlay_menu" >
            <div class="text-right">
              <div class="user-summary-name mr-2 font-medium" v-if="userName" v-text="userName"></div>
              <div class="user-summary-position mr-2 text-sm" v-if="userType" v-text="userType"></div>
            </div>
            <Avatar icon="pi pi-user" shape="circle" size="large" />
          </div>
          <Menu
              id="overlay_menu"
              ref="user_menu"
              :model="menu_items"
              :popup="true"
            />
        </div>
        
        <msg :msg="notification" v-if="notification" />
        <widgets />
        <ClientEngagements />
      </div>
  </div> 

  <div v-if="!check">
    <Auth role="ce46e4b1-ffab-4e67-9093-bcc6553d83c7" />
  </div>

</template>

<script>
// import profile from './UserProfile.vue';
import msg from './MessagesNotifications.vue'
import widgets from '../Widgets/MainWidget.vue'
import ClientEngagements from '../Client/ClientTimelineTabs.vue'
import Auth from './Auth.vue'
import AuthRefresh from './AuthRefresh.vue'
import Avatar from "primevue/avatar";
import axios from 'axios'
import Menu from "primevue/menu";
import changePassword from "./changePassword.vue";
import Sidebar from "primevue/sidebar";
// import {storeAuth} from './MainFunctionalities/Auth.vue'

export default {

  components: {
    // profile,
    msg,
    widgets,
    ClientEngagements,
    Auth,
    AuthRefresh,
    Avatar,
    Menu,
    changePassword,
    Sidebar
  },
  data(){
    return{
      userId: String,
        msg: String,
        userName: String,
        userType: String,
        showPass: false,
        check: localStorage.getItem("auth") ? true : false ,
        menu_items: [
        {
          items: [
            {
              label: "Change Password",
              icon: "pi pi-lock",
              command: () => {
                this.showPass = true;
              },
            },
            {
              label: "TECH Support",
              icon: "pi pi-envelope",
              command: () => {
                window.location.href = "mailto:Reach.app@coreach.co";
              },
            },
            {
              label: "Logout",
              icon: "pi pi-power-off",
              command: () => {
                localStorage.clear();
                for (var i = 0; i < 2; i++) {
                  window.clearInterval(i);
                }
                this.check = false;
              },
            },
          ],
        },
      ],
    }
  },
  mounted(){
    if( this.check ){
         let userData = JSON.parse(localStorage.getItem('myData'));
        this.userId = userData.id;

      if(userData.role.name == 'Coach'){

        this.msg = 'Hello Coach ' + userData.first_name + '!';
        
        let response = this.callCoachData(this.userId);

        response.then((resp)=>{
          if(resp.status == 200){
            this.userName = resp.data.data[0].fullname;
            
            if(resp.data.data.coach_inhouse == false){
              this.userType = 'Associate Coach';
            }
            else{
              this.userType = 'In-house Coach';
            }
          }
        });
      }
      else{
        if(userData.role.name == 'Client Portal'){
          if (userData.data_token != null) {
              this.decryptClient(userData.data_token);
            } else {
              this.msg = "Hello " + userData.first_name + "!";
              this.userName = userData.first_name + " " + userData.last_name;
            }

        // this.msg = 'Hello ' + userData.first_name + '!';
        // this.userName = userData.first_name +' '+ userData.last_name;
        
        let response = this.callClientData();

        response.then((resp)=>{
          if(resp.status == 200){
            this.userType = resp.data.data[0].name;
          }
        });

      }
     }
    }
  },
  methods:{
      toggleUserMenu(ev) {
      this.$refs.user_menu.toggle(ev);
    },
      callCoachData(coachId){
        let token = localStorage.getItem('auth');
            const config = {
            headers: { Authorization: `Bearer ${token}` }
            };
            let filter = {
            coach_id:{"_eq": coachId}
            };

            return axios.get('/items/coaches?filter=' + JSON.stringify(filter), config );

      },
      callClientData(){
        let token = localStorage.getItem('auth');
            
        return axios.get('/items/clients',{
            params:{
                fields: "*",
                access_token: token,
            }
        });
      },
      async decryptClient(dataToken) {
       let token = localStorage.getItem('auth');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios.post(
        "/reachify/identify/",
        {
          t: dataToken,
        },
        config
      ).then((resp)=>{
        if(resp.status == 200){
          this.msg = "Hello " + resp.data.name.split(' ')[0] + "!";
          this.userName = resp.data.name;
        }
      })
    },
    }
}


</script>

<style>
.p-timeline-event {
  min-height: 40px;
}
.p-timeline-left .p-timeline-event-opposite {
  display: none !important;
}
.p-submenu-header {
  display: none !important;
}
</style>
