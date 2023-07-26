<template>
  <div class="col-12 lg:col-5" ref="update-my-availabilities">
    <div class="surface-card border-round shadow-2 p-2 md:p-4 h-full">
      <!-- Begin upcoming sessions list -->
      <div class="flex justify-content-between align-items-center mb-4">
        <div class="text-900 font-semibold text-xl text-center md:text-left">
          Upcoming Sessions
        </div>

        <a
          href="#view-my-calendar"
          class="flex no-underline"
          @click="showCalendar()"
        >
          <span class="text-primary font-medium text-sm">View My Calendar</span>
          <i class="pi pi-arrow-right text-primary text-sm ml-2"></i>
        </a>
      </div>
      <Accordion v-if="!empty">
        <AccordionTab v-for="(item, i) of upcomingData" :key="i">
          <template #header>
            <div class="flex w-full align-items-center justify-content-between">
              <span>{{ item.date }}</span>
              <span class="p-badge p-badge-secondary border-round-2xl">{{
                item.time
              }}</span>
            </div>
          </template>

          <div class="flex-auto p-2">
            <div class="flex align-items-center mb-3">
              <i class="pi pi-calendar text-orange-500 text-xl mr-2"></i>
              <span v-if="item.project != null" class="text-500 font-medium">{{
                item.project
              }}</span>
            </div>
            <span
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
              {{ item.coachee }}
            </span>
            <div class="flex align-items-center">
              <span class="font-medium">{{ item.active_step }}</span>
            </div>
          </div>
        </AccordionTab>
      </Accordion>
      <div
        v-if="empty"
        class="
          align-items-center
          border-round
          flex flex-column
          h-fit
          justify-content-center
          mb-4
          mt-1
          p-4
        "
      >
        <i class="pi pi-calendar text-5xl mx-auto mb-4"></i>
        <div class="">
          <p class="m-0 p-0 line-height-3">No Upcoming Sessions</p>
        </div>
      </div>
    </div>
  </div>

  

  <Sidebar
    v-model:visible="displayCalendar"
    :baseZIndex="10000"
    position="right"
    class="large-sidebar w-12"
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
            "
          >
            <span>Project Calendar</span>
          </div>
        </div>
      </div>
    </template>

    <calendarViews />
  </Sidebar>
</template>

<script>
import axios from "axios";
import Dialog from "primevue/dialog";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Button from "primevue/button";
import moment from "moment";
import calendarViews from "./ClientCalendarViews.vue";
import Sidebar from "primevue/sidebar";

export default {
  components: {
    Dialog,
    Accordion,
    AccordionTab,
    Button,
    calendarViews,
    Sidebar,
  },
  data() {
    return {
      upcoming: [],
      token: String,
      upcomingData: [],
      display_update_availabilities: false,
      userId: String,
      displayCalendar: false,
      empty: true
    };
  },
  mounted() {
    let userData = JSON.parse(localStorage.getItem("myData"));
    this.userId = userData.id;

    this.token = localStorage.getItem("auth");
    this.getUpcomingSess();
  },
  methods: {
    getUpcomingSess() {
      axios
        .get("/items/appointments", {
          params: {
            fields:
              "*,coach.coach_id.id,coachee.id,coachee.first_name,coachee.last_name, project_code.title",
            access_token: this.token,
            filter: {
              status: { _eq: "confirmed" },
              session_status: { _eq: "pending" },
              coachee: { _nnull: true },
            },
            sort: "start",
          },
        })
        .then((resp) => {
          if (resp.status == 200) {
          
            this.upcoming = resp.data.data;
            // this.processUpcoming();
            this.checkTokenize();
          }
        });
    },
    async checkTokenize() {
      let currDate = moment(new Date());

      const newData = this.upcoming.filter((dt) => moment(dt.start) > currDate);
      this.empty = newData.length > 0 ? false : true;

      if (newData.length > 0) {
        let coacheesIds = newData.map((item) => item.coachee.id);

        axios
          .get("/users", {
            params: {
              fields: "*",
              access_token: this.token,
              filter: {
                id: { _in: coacheesIds.join(',') },
              },
            },
          })
          .then((resp) => {
            if (resp.status == 200) {
              let tokenizedUsers = resp.data.data.filter(
                (item) => item.data_token != null
              );

              if (tokenizedUsers.length > 0) {
                let initialData = newData.map((item) => {
                  return {
                    title: item.title,
                    date: moment(item.start).format("dddd MMM Do YY"),
                    time: moment(item.start).format("h:mm a"),
                    project: item.project_code.title,
                    coachee: tokenizedUsers.filter(
                      (tokenized) => tokenized.id == item.coachee.id
                    )[0]
                      ? ""
                      : item.coachee.first_name + " " + item.coachee.last_name,
                    active_step: item.title,
                    token: tokenizedUsers.filter(
                      (tokenized) => tokenized.id == item.coachee.id
                    )[0]
                      ? tokenizedUsers.filter(
                          (tokenized) => tokenized.id == item.coachee.id
                        )[0].data_token
                      : null,
                  };
                });

                tokenizedUsers = tokenizedUsers.map((item) => item.data_token);

                this.decryptUsers(tokenizedUsers, initialData);
              } else {
                this.upcomingData = newData.map((item) => {
                  return {
                    title: item.title,
                    date: moment(item.start).format("dddd MMM Do YY"),
                    time: moment(item.start).format("h:mm a"),
                    project: item.project_code.title,
                    coachee:
                      item.coachee.first_name + " " + item.coachee.last_name,
                    active_step: item.title,
                  };
                });
              }
            }
          });
      }
    },
    async decryptUsers(dataTokens, initialData) {
      const config = {
        headers: { Authorization: `Bearer ${this.token}` },
      };
      axios
        .post(
          "/reachify/batch/",
          {
            tokens: dataTokens,
          },
          config
        )
        .then((resp) => {
          if (resp.status == 200) {
            this.upcomingData = initialData.map((item) => {
              return {
                title: item.title,
                date: item.date,
                time: item.time,
                project: item.project,
                coachee: resp.data.filter((dec) => dec.token == item.token)[0]
                  ? resp.data.filter((dec) => dec.token == item.token)[0].name
                  : item.coachee,
                active_step: item.active_step,
              };
            });
            if (this.upcomingData.length > 20) {
              this.upcomingData = this.upcomingData.slice(0, 20);
            }
          }
        });
    },
    // processUpcoming() {
    //   let currDate = moment(new Date());

    //   const newData = this.upcoming.filter((dt) => moment(dt.start) > currDate);

    //   newData.forEach((item) => {
    //     this.upcomingData.push({
    //       title: item.title,
    //       date: moment(item.start).format("dddd MMM Do YY"),
    //       time: moment(item.start).format("h:mm a"),
    //       project: item.project_code.title,
    //       coachee: item.coachee.first_name + " " + item.coachee.last_name,
    //       active_step: item.title,
    //     });
    //   });
    //   if (this.upcomingData.length > 20) {
    //     this.upcomingData = this.upcomingData.slice(0, 20);
    //   }
    // },
    showCalendar() {
      this.displayCalendar = true;
    },
  },
};
</script>

<style>
</style>