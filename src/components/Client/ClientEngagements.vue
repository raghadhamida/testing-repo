<template>
  <div
    v-if="!load_timeline"
    class="flex align-items-center justify-content-start"
  >
    <ProgressSpinner
      style="width: 30px; height: 30px; stroke: blue"
      strokeWidth="5"
    />
  </div>

  <!-- Timeline Starts Here -->
  <div v-if="load_timeline">
    <Timeline :value="events">
      <template #marker="slotProps">
        <span
          class="timeline-marker shadow-2 p-3 text-white border-round-xl"
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
          <div class="text-900 font-medium mb-1 mt-2 text-lg">
            {{ slotProps.item.status }}
          </div>

          <div v-if="slotProps.item.coach_steps">
            <Timeline :value="slotProps.item.coach_steps">
              <template #marker="coachStepsProps">
                <i :class="coachStepsProps.item.icon" class="mt-2"></i>
              </template>
              <template #content="coachStepsProps">
                <div class="text-900 font-medium my-1 text">
                  {{ coachStepsProps.item.status }}
                </div>
              </template>
            </Timeline>
          </div>

          <!-- <div v-if="slotProps.item.availabilities">
                <p class="mb-4 text-sm">
                  Manage and view your availabilities &amp; booking slots here.
                </p>
                <Timeline :value="coachAva">
                   <template #marker="coachAvailProps">
                    <i v-if="coachAvailProps.item.status === 'updated'" class="pi pi-check-circle text-green-500 font-semibold"></i>
                  </template>
                  <template #content="coachAvailProps">
                    <div class="text-900 font-medium mb-1 text">
                      {{ coachAvailProps.item.title }}
                    </div>
                  </template>
                </Timeline>
              </div> -->

          <div v-if="slotProps.item.sessions && coachees_listed">
            <p class="mb-4 text-sm">
              Track your employees' Coaching Sessions &amp; progress.
            </p>
            <Timeline :value="coaching_sessions">
              <template #content="sessionProps">
                <div class="text-900 font-medium mb-1 text">
                  {{ sessionProps.item.content }}
                </div>
                <AvatarGroup class="mb-4">
                  <Avatar
                    v-for="(coachee, i) of sessionProps.item.coachees.slice(
                      0,
                      8
                    )"
                    :key="i"
                    :label="makeCoacheeLabel(coachee, true)"
                    class="mr-2 text-sm"
                    size="large"
                    shape="circle"
                    v-tooltip.top="{
                      value: makeCoacheeLabel(coachee),
                      class: 'text-xs',
                    }"
                  />
                  <Avatar
                    v-if="
                      sessionProps.item.coachees &&
                      sessionProps.item.coachees.length > 8
                    "
                    :label="`+${sessionProps.item.coachees.length - 8}`"
                    class="bg-blue-600 text-0 text-xs font-bold cursor-pointer"
                    shape="circle"
                    size="large"
                    @click="showCoachee = sessionProps.item"
                  />
                </AvatarGroup>
              </template>
            </Timeline>
          </div>
        </div>
      </template>
    </Timeline>
  </div>

  <Sidebar
    v-model:visible="showCoachee"
    :baseZIndex="10000"
    position="right"
    class="large-sidebar w-12 md:w-4 min-w-4"
  >
    <template #header>
      <div class="flex align-items-start justify-items-start">
        <div>
          <span class="font-medium text-lg mb-1 block">
            {{ projectName }}
          </span>
          <br />
          <span>
            {{ showCoachee.content }}
          </span>
        </div>
      </div>
    </template>
    <ul class="list-none p-0 m-0">
      <li
        class="flex align-items-center py-3 px-2
          border-top-1
          surface-border
          flex-wrap
        "
        v-for="(coachee, i) of showCoachee.coachees"
        :key="i"
      >
      <!-- <span class="text-xs">{{coachee}}</span> -->
        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 text-sm" v-if="coachee.coachee.data_token">
          <i class="bg-green-500 border-round-3xl mr-2 p-2 pi pi-user text-sm text-white"></i>
          {{ makeCoacheeLabel(coachee, false) }}
        </div>
        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 text-sm" v-else>
          <i class="bg-green-500 border-round-3xl mr-2 p-2 pi pi-user text-sm text-white"></i>
          {{ coachee.first_name }} {{ coachee.last_name }}
        </div>
        <div class="w-6 md:w-2 flex justify-content-end"></div>
      </li>
    </ul>
  </Sidebar>
</template>

<script>
import axios from "axios";
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";
import Timeline from "primevue/timeline";
import ProgressSpinner from "primevue/progressspinner";
import Sidebar from "primevue/sidebar";

export default {
  props: {
    projectCode: String,
    projectName: String,
  },
  components: {
    Avatar,
    AvatarGroup,
    Timeline,
    ProgressSpinner,
    Sidebar,
  },
  data() {
    return {
      userId: String,
      token: String,
      sessTimeline: [],
      sessCoachees: [],
      coacheesIDs: [],
      coachees_listed: null,
      coachAva: [],
      processedIds: [],
      load_timeline: false,
      coaching_sessions: [],
      projectStages: [],
      showCoachee: false,
      events: [
        {
          status: "Stage 1 - EQi Journey",
          icon: "pi pi-check-circle",
          color: "#9C27B0",
          coach_steps: [
            {
              status: "EQi Assessment",
              date_completed: "19th Jan 2023",
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

    let userData = JSON.parse(localStorage.getItem("myData"));
    this.userId = userData.id;

    let projectResp = this.getProjectAssign();

    projectResp.then((resp) => {
      if (resp.status === 200) {
        this.coacheesIDs = resp.data.data[0].coachees.map(
          (item) => item.directus_users_id.id
        );
        this.getProjectSteps();
        // this.getCoachAv(resp.data.data[0].project_code.project_code);

        // let stepsData = this.processSteps(coacheesIDs);
      }
    });
  },
  methods: {
    // async getCoachAv(){
    //   axios.get("/items/coach_availabilities", {
    //     params: {
    //       fields: "title,due_date,project_code.project_code,status",
    //       access_token: this.token,
    //       filter: {
    //         project_code: { project_code: { _eq: 'FM31814' } },
    //       },
    //       sort: "due_date",
    //     },
    //   }).then((resp)=>{
    //     if(resp.status == 200){
    //       this.coachAva = resp.data.data;
    //     }
    //   });
    // },
    async getProjectAssign() {
      return axios.get("/items/customerTimelineClients", {
        params: {
          fields: "*,coachees.directus_users_id.id",
          access_token: this.token,
          filter: {
            project_code: { project_code: { _eq: this.projectCode } },
          },
        },
      });
    },
    async getProjectSteps() {
      axios
        .get("/items/customerTimeline", {
          params: {
            fields: "id,content,step.project_code",
            access_token: this.token,
            filter: {
              step: {
                project_code: { project_code: { _eq: this.projectCode } },
              },
              has_coaching: { _eq: true },
            },
            sort: "sort",
          },
        })
        .then((resp) => {
          if (resp.status == 200) {
            this.sessTimeline = resp.data.data;
            this.getStepCoachees();
          }
        });
    },
    async getStepCoachees() {
      axios
        .get("/items/customerTimelineCompletedSteps", {
          params: {
            fields:
              "step,coachee.id,coachee.first_name,coachee.last_name,coachee.data_token,step.id,step.sort,step.step.project_code.client_key.client_user.id",
            access_token: this.token,
            filter: {
              coachee: { _nnull: true },
              step: { _nnull: true },
              step: {
                step: {
                  project_code: {
                    client_key: { client_user: { id: this.userId } },
                  },
                },
              },
            },
            limit: "-1",
          },
        })
        .then((resp) => {
          if (resp.status == 200) {
            this.sessCoachees = resp.data.data;
            this.coachees_listed = resp.data.data
              .map(({ coachee }) => coachee.data_token)
              .filter((n) => n);
            this.detokenizeBatch(this.coachees_listed);
          }
        });
    },
    processFinalData() {
      let arrData = [];

      this.sessCoachees.forEach((item) => {
        let resp = this.getOccur(this.sessCoachees, item);
        if (resp) {
          arrData.push(resp);
        }
      });

      this.coaching_sessions = this.sessTimeline.map(({ id, ...rest }) => ({
        id,
        ...rest,
        coachees: arrData.filter(({ step }) => step.id === id),
      }));
      this.coaching_sessions.sort();

      // console.log(this.coaching_sessions)
      this.load_timeline = true;
    },
    getOccur(arr, obj) {
      let check = this.processedIds.find(
        (element) => element == obj.coachee.id
      );

      if (!check) {
        this.processedIds.push(obj.coachee.id);
        let repArr = [];

        arr.forEach((item) => {
          if (item.coachee.id == obj.coachee.id) {
            repArr.push(item);
          }
        });

        if (repArr.length > 1) {
          let maxObj = repArr[0];

          repArr.forEach((item) => {
            if (item.step.sort > maxObj.step.sort) {
              maxObj = item;
            }
          });

          return maxObj;
        } else {
          return repArr[0];
        }
      }
    },
    makeCoacheeLabel(coachee, initials_only = false) {
      let label = "";
      if (coachee.coachee.data_token) {
        const fullname = this.getTokenValue("name", coachee.coachee.data_token);
        if (initials_only) {
          const lastname =
            fullname.split(" ").length >= 2 ? fullname.split(" ")[1] : fullname;
          // console.log(lastname)
          label =
            Array.from(fullname.split(" ")[0])[0] + Array.from(lastname)[0];
        } else {
          label = fullname;
        }
      } else {
        if (initials_only) {
          label =
            Array.from(coachee.coachee.first_name)[0] +
            Array.from(coachee.coachee.last_name)[0];
        } else {
          label = coachee.coachee.first_name + " " + coachee.coachee.last_name;
        }
      }
      return label;
    },
    detokenizeBatch(t) {
      axios
        .request({
          method: "POST",
          url: "/reachify/batch",
          headers: {
            Authorization: "Bearer " + this.token,
          },
          data: {
            tokens: t,
          },
        })
        .then((r) => {
          this.detokenized_coachees = r.data;
          this.processFinalData();
        });
    },
    getTokenValue(key, token) {
      if (key && token) {
        return this.detokenized_coachees.find((item) => item.token === token)[
          key
        ];
      }
    },
  },
};
</script>

<style>
</style>