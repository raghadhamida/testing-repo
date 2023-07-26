<template>
  

    <!-- <div class="flex justify-content-center align-items-center md:h-screen">
      <div
        class="
          surface-section
          w-full
          md:w-6
          lg:w-4
          p-3
          md:p-4 md:border-round-3xl
          shadow-1
        "
      > -->

        <div class="w-full md:w-12 mx-auto">
          <label
            for="newPswrdOne"
            class="block text-900 text-xl font-medium mb-2"
            >New Password</label
          >
          <Password
            v-model="firstPass"
            placeholder="New Password"
            :toggleMask="true"
            class="w-full mb-3"
            inputClass="w-full"
            inputStyle="padding:1rem"
            :feedback="false"
          />

          <label
            for="newPswrdTwo"
            class="block text-900 font-medium text-xl mb-2"
            >Confirm Password</label
          >
          <Password
            v-model="secondPass"
            placeholder="Confirm Password"
            :toggleMask="true"
            class="w-full mb-3"
            inputClass="w-full"
            inputStyle="padding:1rem"
            :feedback="false"
          />

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

          <Message
            severity="success"
            v-for="msg of messages"
            :key="msg.content"
            :life="10000"
            :sticky="false"
            :closable="false"
          >
            {{ msg.content }}
          </Message>

          <Button
            label="Confirm"
            class="w-full p-3 text-xl mb-2"
            @click="changePassword"
          />
        </div>
</template>

<script>
import axios from "axios";
import Message from "primevue/message";
import Button from "primevue/button";
import Password from "primevue/password";

export default {
  components: {
    Message,
    Button,
    Password,
  },
  data() {
    return {
      firstPass: null,
      secondPass: null,
      messages: [],
      errors: [],
    };
  },
  methods: {
    changePassword() {
      //let first = document.getElementById("newPswrdOne").value;
      //let second = document.getElementById("newPswrdTwo").value;

      if (this.firstPass == null || this.secondPass == null) {
        this.errors.pop();
        this.errors.push({
          message: "Password & Confirm Password Fields are Required",
        });
        // this.messages.push({severity: 'warn', content: 'Password & Confirm Password Fields are Required', id: this.count});
      } else {
        if (this.firstPass === this.secondPass) {
          let resp = this.callPatch(this.firstPass);
          resp.then((response) => {
            if (response.status == 200) {
              this.messages.pop();
              this.messages.push({ content: "Password Changed Successfully" });
              this.firstPass = null;
              this.secondPass = null;
            }
          });
        } else {
          this.errors.pop();
          this.errors.push({
            message: "Passwords do not match, please try again",
          });
        }
      }
    },
    async callPatch(userPassword) {
      let token = localStorage.getItem("auth");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      return axios.patch(
        "/users/me",
        {
          password: userPassword,
        },
        config
      );
    },
  },
};
</script>

<style>
/* .form-changepswrd {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-changepswrd .checkbox {
  font-weight: 400;
}

.form-changepswrd .form-floating:focus-within {
  z-index: 2;
}

.form-changepswrd input#newPswrdOne {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-changepswrd input#newPswrdTwo {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
} */
</style>