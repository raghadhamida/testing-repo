<template>
  <div class="surface-section" v-if="!loading">
    <div
      class="flex align-items-start flex-column lg:flex-row lg:justify-content-between"
    >
      <div class="flex align-items-start flex-column md:flex-row">
        <div>
          <div class="flex align-items-center flex-wrap text-sm">
            <div class="mr-5 mt-3">
              <span class="font-medium text-500">Completed Sessions</span>
              <div class="text-900 mt-2">
                {{ coacheeData.completedSteps }} / {{ coacheeData.allSteps }}
              </div>
            </div>
            <div class="mr-5 mt-3">
              <span class="font-medium text-500">Next Session</span>
              <div class="text-900 mt-2" v-if="dateLoaded">
                {{ sessionDate }}
              </div>
            </div>
            <SharedFiles
              :types="['coach_report', 'coachee_report']"
              :coachee_id="coacheeId"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="surface-card border-1 border-gray-200 border-round flex px-3 my-4 flex-column md:flex-row"
    >
      <div
        class="border-bottom-1 md:border-bottom-none surface-border flex-auto py-3 align-items-center text-center"
        v-if="coach"
      >
        <div class="flex align-items-center mb-3">
          <span class="text-500 font-medium">Assigned Coach</span>
        </div>

        <div class="flex align-items-center text-left">
          <Avatar
            :key="coach.id"
            :image="getAvatar(coach.display_image)"
            shape="circle"
            size="large"
            class="mr-3 shadow-1"
            style="width: 80px; height: 80px"
          />
          <div class="">
            <span class="block text-900 font-medium mb-1">{{
              coach.fullname
            }}</span>
            <div class="text-600">
              {{ coach.coaching_credentials?.join(", ") }}
            </div>
          </div>
        </div>
      </div>
      <!-- <div
        class="border-bottom-1 md:border-bottom-none surface-border flex-auto py-3 align-items-center text-center w-6"
        v-else
      >
        <AssignCoach
          :project_id="coacheeData.projectCodeId"
          :coachee_id="coacheeId"
          @newCoachAssignment="newCoachAssignment($event)"
        />
      </div> -->

      <div
        
        class="border-bottom-1 md:border-bottom-none surface-border flex-auto py-3 align-items-center text-center w-6"
      >
        <div class="flex align-items-center mb-3">
          <i class="pi pi-chart-pie text-green-500 text-xl mr-2"></i
          ><span class="text-500 font-medium">Journey Progress</span>
        </div>

        <div class="flex justify-content-between align-items-center">
          <span class="text-800">Overall Progress</span
          ><span class="text-900 font-medium">{{ progressPercentage }}%</span>
        </div>
        <div class="bg-green-100 mt-2 mb-3 border-round" style="height: 7px">
          <div
            class="bg-green-500 h-full border-round"
            :style="`width:${progressPercentage}%`"
          ></div>
        </div>
        <div class="flex justify-content-between align-items-center">
          <span class="text-900"
            >{{ coacheeData.completedSteps }} /
            {{ coacheeData.allSteps }} Steps</span
          >
        </div>
      </div>
    </div>

    <CoacheeTimeline
      :coacheeId="coacheeId"
      :projectId="coacheeData.projectID"
    />
  </div>
</template>

<script>
// import Timeline from "primevue/timeline";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import CoacheeTimeline from "./CoacheeTimeline.vue";
// import AssignCoach from "./AssignCoach.vue";
// import SharedFiles from "./Reports/SharedFiles.vue";
import axios from "axios";
import moment from "moment";

export default {
  emits: ["newCoachAssignment"],
  props: {
    coacheeId: String,
    coacheeData: {},
  },
  components: {
    Avatar,
    Button,
    CoacheeTimeline,
    // AssignCoach,
    // SharedFiles,
  },
  data() {
    return {
      userId: JSON.parse(localStorage.getItem("myData")).id,
      token: localStorage.getItem("auth"),
      progressPercentage: null,
      sessionDate: String,
      arrSess: [],
      dateLoaded: false,
      coach: false,
      loading: true,
    };
  },
  mounted() {
    this.getPercentage();
    this.getNextSess();
    this.getAssignedCoach();
  },
  methods: {
    newCoachAssignment(e) {
      this.$emit("newCoachAssignment", {
        assigned_coach: e,
      });
      this.getAssignedCoach();
    },
    async getAssignedCoach() {
      axios
        .get("/items/assignments", {
          params: {
            fields: "*.*",
            access_token: this.token,
            limit: "1",
            sort: "-date_created",
            filter: {
              coachee_id: { id: { _eq: this.coacheeId } },
            },
            meta: "filter_count",
          },
        })
        .then((resp) => {
          if (resp.data.meta.filter_count > 0) {
            this.coach = resp.data.data[0].coach;
            this.loading = false;
          } else {
            this.coach = false;
            this.loading = false;
          }
        })
        .catch((err) => {
          this.coach = false;
          this.loading = false;
        });
    },
    async getNextSess() {
      axios
        .get("/items/appointments", {
          params: {
            fields: "*,coachee.id",
            access_token: this.token,
            filter: {
              status: { _eq: "confirmed" },
              session_status: { _eq: "pending" },
              coachee: { id: { _eq: this.coacheeId } }
            },
            sort: "start",
          },
        })
        .then((resp) => {
          if (resp.status == 200) {
            this.arrSess = resp.data.data;
            //this.sessionDate = moment(resp.data.data[0].start).format("MMM Do YY");
          }
        });
    },
    getPercentage() {
      this.progressPercentage = Math.round(
        (this.coacheeData.completedSteps / this.coacheeData.allSteps) * 100
      );
    },
    getAvatar(id) {
      let img =
        "https://web.coreach.co/wp-content/uploads/2022/09/Picture1.jpg";
      if (id) {
        img = `https://devgrow.coreach.co/assets/${id}?key=profile-display-image`;
      }
      return img;
    },
  },
  watch: {
    arrSess: function (d) {
      let currDate = moment(new Date());

      const newData = d.filter((dt) => moment(dt.start) > currDate);

      if (newData.length > 0) {
        this.sessionDate = moment(newData[0].start).format("MMM Do YYYY");
      } else {
        this.sessionDate = "No upcoming Sessions";
      }

      this.dateLoaded = true;
    },
  },
};
</script>

<style></style>
