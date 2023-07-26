<template>
  <div class="flex align-items-center mb-3">
    <i class="pi pi-clock text-orange-500 text-xl mr-2"></i>
    <span class="text-500 font-medium">Next Session</span>
  </div>
  <span
    v-if="coacheeName"
    class="
      block
      bg-orange-50
      border-round
      font-medium
      mb-4
      px-2
      py-1
      text-900 text-xl
    "
  >
    <span
      class="bg-orange-500 border-round decorator inline-block mr-2"
      style="width: 4px; height: 20px; margin-bottom: -3px"
    ></span>
    {{ coacheeName }}
  </span>
  <div class="flex align-items-center">
    <span class="text-orange-500 font-medium" v-text="sessionTime"></span>
    <span class="ml-2" v-text="sessionDate"></span>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      userId: String,
      arrSessions: [],
      coacheeName: String,
      sessionTime: String,
      sessionDate: String,
      token: localStorage.getItem("auth"),
    };
  },
  mounted() {
    let userData = JSON.parse(localStorage.getItem("myData"));
    this.userId = userData.id;

    if (
      userData.role.name == "Coach" ||
      userData.role.name == "Client Portal"
    ) {
      let sessResp = this.getUpcomingSessions();
      sessResp.then((resp) => {
        if (resp.status == 200) {
          this.arrSessions = resp.data.data;
        }
      });
    }
  },
  methods: {
    async getUpcomingSessions() {
      return axios.get("/items/appointments", {
        params: {
          fields:
            "*,coach.coach_id.id,coachee.id,coachee.first_name,coachee.last_name",
          access_token: this.token,
          filter: {
            status: { _eq: "confirmed" },
            session_status: { _eq: "pending" },
            coachee: { _nnull: true },
          },
          sort: "start",
        },
      });
    },
    async checkTokenize(coacheeData) {
      axios
        .get("/users", {
          params: {
            fields: "*",
            access_token: this.token,
            filter: {
              id: { _eq: coacheeData[0].coachee.id },
            },
          },
        })
        .then((resp) => {
          if (resp.status == 200) {
            if (resp.data.data[0].data_token != null) {
              this.decryptUser(resp.data.data[0].data_token, coacheeData);
            } 
            else {
              this.coacheeName =
                coacheeData[0].coachee.first_name +
                " " +
                coacheeData[0].coachee.last_name;
              this.sessionDate = moment(coacheeData[0].start).calendar();
              this.sessionTime = moment(coacheeData[0].start).fromNow();
            }
          }
        });
    },
    async decryptUser(dataToken, coacheeData) {
      const config = {
        headers: { Authorization: `Bearer ${this.token}` },
      };
      axios
        .post(
          "/reachify/identify/",
          {
            t: dataToken,
          },
          config
        )
        .then((resp) => {
          if (resp.status == 200) {
              this.coacheeName = resp.data.name;
              this.sessionDate = moment(coacheeData[0].start).calendar();
              this.sessionTime = moment(coacheeData[0].start).fromNow();
          }
        });
    },
  },
  watch: {
    arrSessions: function (d) {
      let currDate = moment(new Date());

      const newData = d.filter((dt) => moment(dt.start) > currDate);
      // let moments = newData.map(dt_ => moment(dt_.start)),
      // minDate = moment.min(moments);

      if (newData.length > 0) {
        this.checkTokenize(newData);
      } else {
        this.coacheeName = "No Upcoming Sessions";
        this.sessionDate = "-";
        this.sessionTime = "-";
      }
    },
  },
};
</script>

<style>
</style>