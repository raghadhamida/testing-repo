<template>
  <!-- Timeline Strats Here -->
  <div v-if="load_timeline">
    <Timeline :value="events">
      <template #marker="slotProps">
        <span
          class="timeline-marker shadow-2 p-2 md:p-3 text-white border-round-xl"
          :style="{ backgroundColor: slotProps.item.color }"
        >
          <i :class="slotProps.item.icon" class="text-xl"></i>
        </span>
      </template>
      <template #opposite="slotProps">
        <small class="p-text-secondary">{{ slotProps.item.date }}</small>
      </template>
      <template #content="slotProps">
        <div class="mb-4">
          <div class="text-900 font-medium mb-1 mt-3 text-lg">
            {{ slotProps.item.status }}
          </div>

          <div v-if="slotProps.item.coach_steps">
            <Timeline :value="slotProps.item.coach_steps">
              <template #marker="coachStepsProps">
                <i :class="coachStepsProps.item.icon"></i>
              </template>
              <template #content="coachStepsProps">
                <div class="text-900 font-medium mb-1 text">
                  {{ coachStepsProps.item.status }}
                  <!-- <small
                    class="
                      text-xs text-green-600
                      bg-green-50
                      border-1 border-green-200
                      py-1
                      px-2
                      ml-2
                      border-round
                    "
                  >
                    Completed on
                    {{ coachStepsProps.item.date_completed }}
                  </small> -->
                </div>
              </template>
            </Timeline>
          </div>

          <div v-if="slotProps.item.sessions">
            <Timeline :value="finalData">
              <template #marker="sessionProps">
                <!-- JAN 4: updated the new active step animation as per ux comments -->
                <div v-if="sessionProps.item.isActive && !sessionProps.item.completed" class="pulse"></div>
                <i
                  :class="{
                    'pi pi-circle text-gray-300 font-bold':
                      !sessionProps.item.completed && !sessionProps.item.isActive,
                  }"
                ></i>
                <i
                  :class="{
                    'pi pi-check-circle text-green-500 font-semibold':
                      sessionProps.item.completed,
                  }"
                ></i>

                <!-- update ends the new active step animation as per ux comments -->
              </template>
              <template #content="sessionProps">
                <div class="text-900 font-medium mb-1 text">
                  {{ sessionProps.item.content }}
                </div>
              </template>
            </Timeline>
          </div>
        </div>
      </template>
    </Timeline>
  </div>
</template>

<script>
import axios from "axios";
import Timeline from "primevue/timeline";

// import myCoaches from "./MyCoaches.vue";

export default {
  props: {
    coacheeId: String,
    projectId: String,
  },
  components: {
    Timeline,
    // myCoaches,
  },
  data() {
    return {
      userId: String,
      token: String,
      allSessions: [],
      completedSess: [],
      finalData: [],
      load_timeline: false,
      coaching_sessions: [],
      events: [
        {
          status: "Stage 1 - EQi Journey",
          icon: "pi pi-check-circle",
          color: "#9C27B0",
          coach_steps: [
            {
              status: "EQi Assessment",
              // date_completed: "19th Jan 2023",
              icon: "pi pi-check-circle text-green-500 font-semibold",
            },
          ],
        },
        {
          status: "Stage 2 - Coaching Sessions",
          icon: "pi pi-calendar",
          color: "#FF9800",
          sessions: true,
        },
      ],
    };
  },
  async mounted() {
    this.token = localStorage.getItem("auth");

    // let userData = JSON.parse(localStorage.getItem("myData"));
    // this.userId = userData.id;

    this.getAllSteps();
  },
  methods: {
    // async getProjectCode(){

    //   axios.get("/items/customerTimelineClients", {
    //     params: {
    //       fields: "*",
    //       access_token: this.token,
    //       filter: {
    //           step: { project_code: { id: { _in: projectCodes } } },
    //           has_coaching: { _eq: "true" },
    //         }
    //     },
    //   }).then((resp)=>{
    //     if(resp.status == 200){
    //       this.getAllSteps(resp.data.data[0].project_code);
    //     }
    //   });

    // },
    async getAllSteps() {
      axios
        .get("/items/customerTimeline", {
          params: {
            fields: "*,step.project_code.id",
            access_token: this.token,
            filter: {
              step:{project_code:{id: { _eq: this.projectId} } },
              has_coaching: { _eq: "true" },
            },
          },
        })
        .then((resp) => {
          if (resp.status == 200) {
            this.allSessions = resp.data.data;
            this.getCompletedSteps();
          }
        });
    },
    async getCompletedSteps() {
      axios
        .get("/items/customerTimelineCompletedSteps", {
          params: {
            fields:
              "activate_next,step.has_coaching,step.sort, step.id, action,coachee.id",
            access_token: this.token,
            filter: {
              step: { has_coaching: { _eq: "true" } },
              coachee: { id: { _eq: this.coacheeId } },
            },
          },
        })
        .then((resp) => {
          if (resp.status == 200) {
            this.completedSess = resp.data.data;
            this.processFinalData();
          }
        });
    },
    processFinalData() {
      this.coaching_sessions = this.allSessions.map(({ id, content }) => ({
        id,
        content,
        step: this.completedSess.filter(({ step }) => step.id === id),
      }));
      let maxId = Math.max(...this.completedSess.map((item) => item.step.sort));

      this.coaching_sessions.forEach((item) => {
        if (item.step.length > 0) {
          if (item.step[0].step.sort == maxId) {
            this.finalData.push({
              content: item.content,
              isActive: true,
              action: item.step[0].action,
              completed: false,
            });
          } else {
            this.finalData.push({
              content: item.content,
              isActive: false,
              action: null,
              completed: true,
            });
          }
        } else {
          this.finalData.push({
            content: item.content,
            isActive: false,
            action: null,
            completed: false,
          });
        }
      });
      this.load_timeline = true;
    },
  },
};
</script>

<style>
</style>