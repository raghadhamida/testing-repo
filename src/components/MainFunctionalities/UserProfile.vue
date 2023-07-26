<template>
    <div v-if="check">
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
    </div>

    <div v-if="!check"> -->
    <Auth role="ce46e4b1-ffab-4e67-9093-bcc6553d83c7" />
   </div>  
</template>

<script>

import {storeAuth} from './HelloClient.vue'
import Avatar from "primevue/avatar";
import axios from 'axios'
import Menu from "primevue/menu";
import Auth from './Auth.vue'


export default {
    components:{
       Avatar,
       Menu,
       Auth 
    },
    data(){
      return{
        userId: String,
        msg: String,
        userName: String,
        userType: String,
        check: localStorage.getItem("auth") ? true : false ,
        menu_items: [
          {
            items: [
              {
                label: "Settings",
                icon: "pi pi-cog",
                command: () => {
                  console.log("Goto User Settings page");
                },
              },
              {
                label: "Logout",
                icon: "pi pi-power-off",
                command: () => {
                  localStorage.clear();
                  storeAuth.auth = {authenticated: localStorage.getItem("auth") ? true : false , token: localStorage.getItem("auth"),
                        me:  localStorage.getItem("myData")};
                  this.check = false;
                },
              },
            ],
          },
        ],
      }
    },
    mounted(){
      console.log(storeAuth);
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

        this.msg = 'Hello ' + userData.first_name + '!';
        this.userName = userData.first_name +' '+ userData.last_name;
        
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
                access_token: token,
            }
        });
      }
    }
}
</script>

<style>

.p-submenu-header {
  display: none !important;
}

</style>