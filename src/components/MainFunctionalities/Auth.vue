<template>
  <div class="flex justify-content-center align-items-center md:h-screen">
    <div
      class="surface-section w-full md:w-6 lg:w-4 p-3 md:p-4 md:border-round-3xl shadow-1"
    >
      <div class="flex justify-content-between align-items-center mb-5">
        <div>
          <div class="text-900 text-3xl font-medium mb-2">Welcome!</div>
          <div class="text-600 font-medium">Please Sign in to continue</div>
        </div>
        <img
          src="../../assets/logo-dark.svg"
          alt="Logo"
          style="max-width: 60px"
          class="mt-4 mb-2 w-4 md:w-4 flipup animation-duration-500"
        />
      </div>

      <div class="w-full md:w-12 mx-auto">
        <label for="email1" class="block text-900 text-xl font-medium mb-2"
          >Email</label
        >
        <InputText
          id="email1"
          v-model="email"
          type="text"
          class="w-full mb-3"
          placeholder="Email"
          style="padding: 1rem"
        />

        <label for="password1" class="block text-900 font-medium text-xl mb-2"
          >Password</label
        >
        <Password
          id="password1"
          v-model="password"
          placeholder="Password"
          :toggleMask="true"
          class="w-full mb-3"
          inputClass="w-full"
          inputStyle="padding:1rem"
          :feedback="false"
        ></Password>

        <Message
          severity="error"
          v-for="err of errors"
          :key="err.message"
          :life="10000"
          :sticky="false"
          :closable="false"
        >
          {{ err.message }}
        </Message>

        <Button
          label="Sign In"
          class="w-full p-3 text-xl mb-2"
          @click="signin"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Message from "primevue/message";
import { reactive } from 'vue'

export default {
  props: {
    role: {
      type: String,
      default: "*",
    },
  },
  components: {
    InputText,
    Password,
    Button,
    Message,
  },
  data() {
    return {
      loginCheck: false,
      errors: [],
      email: null,
      password: null,
    };
  },
  methods: {
    signin() {
      if (this.email != null && this.password != null) {
        let response = this.userLogin(this.email, this.password);

        response
          .then((resp) => {
            if (resp.status == 200) {

                localStorage.setItem("auth", resp.data.data.access_token);
                localStorage.setItem("refresh", resp.data.data.refresh_token);

                axios
                  .get("/users/me", {
                    params: {
                      fields: "*,role.id, role.name",
                      access_token: resp.data.data.access_token,
                    },
                  })
                  .then((resp) => {
                    if (resp.status == 200) {

                        localStorage.setItem(
                                "myData",
                                JSON.stringify(resp.data.data)
                                );

                        if (this.role !== "*") {
                            if(resp.data.data.role.id === this.role){
                                window.location.reload();
                            }else{
                                this.errors.push({ message: "Authentication Failed" })
                                localStorage.clear();
                            }
                        }else{
                            window.location.reload();
                        }

                    }
                  })
                  .catch((err) => {
                    this.errors = err.response.data.errors;
                  });
              } else {
                this.loginCheck = true;
              }
          })
          .catch((err) => {
            this.errors = err.response.data.errors;
            // console.error(err);
            console.log(this.errors);
          });
      }else{
        this.errors = [{ message: "Please enter your credentials" }]
      }
    },
    async userLogin(uemail, upassowrd) {
      return axios.post("/auth/login/", {
        email: uemail,
        password: upassowrd,
      });
    },
  },
}

</script>
<style></style>
