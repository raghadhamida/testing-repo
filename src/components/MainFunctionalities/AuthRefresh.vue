<template lang="">
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      auth: {
        authenticated: localStorage.getItem("auth") ? true : false,
        token: localStorage.getItem("auth")
          ? localStorage.getItem("auth")
          : false,
        refresh: localStorage.getItem("refresh")
          ? localStorage.getItem("refresh")
          : false,
        me: localStorage.getItem("myData")
          ? JSON.parse(localStorage.getItem("myData"))
          : false,
      },
      refresh_status: 0,
    };
  },
  mounted() {
    const validateMyData = localStorage.getItem("myData") ? JSON.parse(localStorage.getItem("myData")) : false
    if(!validateMyData){
      this.refreshToken();
    }
    if(this.auth.authenticated){
        setInterval(() => {
          this.refreshToken();
        }, 25000);
    }
  },
  methods: {
    refreshToken() {
      const validate_refresh = localStorage.getItem("refresh") ? localStorage.getItem("refresh") : false
      if( validate_refresh ){
        axios
          .post("/auth/refresh/", {
            refresh_token: localStorage.getItem("refresh"),
            mode: "json",
          })
          .then((r) => {
            this.auth.refresh = r.data.data.refresh_token;
            localStorage.setItem("refresh", r.data.data.refresh_token);
            localStorage.setItem("auth", r.data.data.access_token);
            const validateMyData = localStorage.getItem("myData") ? JSON.parse(localStorage.getItem("myData")) : false
            if(!validateMyData){
              this.getMyProfile();
            }
            this.refresh_status++;
          })
          .catch((e) => {
            for (var i = 0; i < 2; i++){
              window.clearInterval(i);
            }
            this.auth.authenticated = false;
            localStorage.clear()
            window.location.reload()
          })
      }else{
          for (var i = 0; i < 2; i++){
            window.clearInterval(i);
          }
          this.auth.authenticated = false;
          localStorage.clear()
          window.location.reload()
      }
    },
    getMyProfile(){
      axios
        .get("/users/me?access_token=" + this.auth.token + "&fields=*,role.*")
        .then((r) => {
          localStorage.setItem("myData", JSON.stringify(r.data.data) );
          window.location.reload()
        })
    }
  },
};
</script>
<style lang=""></style>
