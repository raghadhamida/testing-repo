<template lang="">
  <div class="my-3">
    <div class="surface-card shadow-1 p-4 border-round">
      <div
        class="flex align-items-center justify-content-between pb-3 border-bottom-1 surface-border mb-4"
      >
        <h2 class="my-2">
          <i
            class="pi pi-calendar text-bluegray-500 font-semibold text-xl mr-2 text-left"
          ></i>
          {{ formatDate(selectedDate[0], "MMM DD") }}
          <span v-if="selectedDate[1]">
            to {{ formatDate(selectedDate[1], "MMM DD, YYYY") }}</span
          >
        </h2>

        <div
          class="title-view-options flex justify-content-between align-items-center"
        >
          <div v-for="(filter, i) of filterOptions" :key="i" class="ml-2">
            <span class="block mb-2 text-xs capitalize"
              >Filter by {{ i.replaceAll("_", " ") }}</span
            >
            <SelectButton
              v-model="filters[i]"
              :options="filterOptions[i]"
              class="capitalize font-medium"
              :multiple="true"
              @change="getSessions"
            >
              <template #option="slotProps">
                <div class="text-xs">
                  {{ slotProps.option.label }}
                </div>
              </template>
            </SelectButton>
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="col-12 md:col-4">
          <Calendar
            v-model="selectedDate"
            :inline="true"
            class="border-none w-full sticky top-0 pt-2"
            selectionMode="range"
            panelClass="surface-border select-none"
          />
        </div>
        <div class="col-12 md:col">
          <ul class="list-none p-0 m-0" v-if="sessionsData.length > 0">
            <li
              class="py-3 border-bottom-1 surface-border flex md:align-items-start md:justify-content-between flex-column md:flex-row"
              v-for="s of sessionsData"
              :key="s.id"
              :class="{
                'opacity-40': s.session_status === 'ended',
              }"
            >
              <div class="flex align-items-start mr-0 lg:mr-5">
                <Avatar
                  v-if="s.coachee"
                  v-tooltip.top="{
                    value: s.coachee,
                    class: 'text-xs',
                  }"
                  :image="getAvatar()"
                  shape="circle"
                  size="large"
                  class="w-3rem h-3rem mr-3"
                />
                <Avatar
                  v-else
                  v-tooltip.top="{
                    value: 'Free Slot',
                    class: 'text-xs',
                  }"
                  icon="pi pi-check-circle"
                  shape="circle"
                  size="large"
                  class="w-3rem h-3rem mr-3 bg-primary"
                />
                <div>
                  <span v-if="s.coachee">
                    <span
                      class="text-900 font-medium block mb-1"
                      :class="{
                        'line-through': s.session_status === 'ended',
                      }"
                      >{{ s.title }} with {{ s.coachee }}</span
                    >
                  </span>
                  <span v-else>
                    <span class="text-900 font-medium block mb-1"
                      >Available for Booking</span
                    >
                  </span>
                  <div class="text-700 text-sm mb-2">
                    <span v-if="s.project">
                      <span
                        class="px-2 py-1 capitalize text-xs border-round-3xl bg-bluegray-50 font-semibold text-700 mr-1"
                        v-tooltip.top="{
                          value: 'Project',
                          class: 'text-xs',
                        }"
                        >{{ s.project }}</span
                      ></span
                    >
                    <span
                      class="px-2 py-1 capitalize text-xs border-round-3xl font-medium text-700 mr-1 inline-block mb-1"
                      v-tooltip.top="{
                        value: 'Session Status',
                        class: 'text-xs',
                      }"
                      :class="{
                        'bg-green-100 text-green-600':
                          s.session_status === 'ended',
                        'bg-yellow-100 text-yellow-600':
                          (s.session_status === 'pending' && !checkDates(s.datetime)),
                          'bg-red-100 text-red-700':
                          (s.session_status === 'pending' && checkDates(s.datetime)),
                        'bg-green-500 text-white':
                          s.session_status === 'started',
                      }"
                      >
                      <div v-if="s.session_status === 'pending' && checkDates(s.datetime)">Session Overdue</div>
                      <div v-if="s.session_status === 'pending' && !checkDates(s.datetime)">Confirmed</div>
                      </span
                      
                    >
                    
                    <span
                      class="px-2 py-1 capitalize text-xs border-round-3xl font-medium text-700 mr-1 inline-block mb-1"
                      v-tooltip.top="{
                        value: 'Session Type',
                        class: 'text-xs',
                      }"
                      :class="{
                        'bg-blue-100 text-blue-600':
                          s.session_type === 'online',
                        'bg-orange-100 text-orange-600':
                          s.session_type === 'onsite',
                      }"
                      >{{ s.session_type }}</span
                    >
                  </div>
                </div>
              </div>
              <span
                class="block text-600 text-xs font-medium ml-auto mr-1 mt-2 md:mt-0"
              >
                <span>{{ formatDate(s.datetime, "dddd, MMM DD") }} at </span>
                {{ s.time }}
              </span>
            </li>
          </ul>

          <div
            v-else
            class="w-full h-full flex align-items-center justify-content-center"
          >
            <div class="no-items-notification">
              <div class="text-center">
                <i class="pi pi-exclamation-circle text-800 text-4xl mb-3"></i>
                <div class="flex lg:align-items-start flex-column lg:flex-row">
                  <div class="text-800 font-medium lg:mb-0 line-height-3">
                    No Bookings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Calendar from "primevue/calendar";
import moment from "moment";
import axios from "axios";
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";
import SelectButton from "primevue/selectbutton";

export default {
  components: {
    Calendar,
    Avatar,
    AvatarGroup,
    SelectButton,
  },
  data() {
    return {
      auth: {
        authenticated: localStorage.getItem("auth") ? true : false,
        token: localStorage.getItem("auth")
          ? localStorage.getItem("auth")
          : false,
        me: localStorage.getItem("myData")
          ? JSON.parse(localStorage.getItem("myData"))
          : false,
      },
      today: new Date(),
      coachees_listed: null,
      calendarMode: "single",
      calendarModeOptions: ["single", "range"],
      filters: {
        session_status: [{ option: "pending", label: "Upcoming" }],
        status: [
          { option: "pending", label: "Available" },
          { option: "confirmed", label: "Confirmed" },
        ],
        session_type: [
          { option: "online", label: "Online" },
          { option: "onsite", label: "Onsite" },
        ],
      },
      filterOptions: {
        session_status: [
          { option: "started", label: "Ongoing" },
          { option: "ended", label: "Completed" },
          { option: "pending", label: "Upcoming" },
        ],
        status: [
          // { option: "pending", label: "Available" },
          { option: "confirmed", label: "Confirmed" },
          { option: "cancelled", label: "Cancelled" },
        ],
        session_type: [
          { option: "online", label: "Online" },
          { option: "onsite", label: "Onsite" },
        ],
      },
      selectedDate: [],
      sessionsData: [],
      token: localStorage.getItem("auth"),
    };
  },
  mounted() {
    this.initCal();
  },
  watch: {
    selectedDate: function (date) {
      const start =
        this.formatDate(this.selectedDate[0], "YYYY-MM-DD") + "T00:00:00";
      const end =
        this.formatDate(this.selectedDate[1], "YYYY-MM-DD") + "T24:00:00";
      if (this.selectedDate[1]) {
        this.getSessions();
      }
    },
  },
  methods: {
    checkDates(date){
      return moment(date) < moment(this.today) ;
    },
    initCal() {
      console.log(this.coach);
      const date = new Date();
      const month = date.getMonth();
      const year = date.getFullYear();
      const startDt = new Date(year, month, 1);
      const endDt = new Date(year, month + 1, 0);
      this.selectedDate = [startDt, endDt];
    },
    formatDate(d, f = "DD-MM-YYYY") {
      return moment(d).format(f);
    },
    getAvatar(id) {
      let img =
        "https://web.coreach.co/wp-content/uploads/2022/09/Picture1.jpg";
      if (id) {
        img = `https://reach.grow.coreach.co/assets/${id}?key=profile-display-image`;
      }
      return img;
    },
    getSessions() {
      const start =
        this.formatDate(this.selectedDate[0], "YYYY-MM-DD") + "T00:00:00";
      const end =
        this.formatDate(this.selectedDate[1], "YYYY-MM-DD") + "T24:00:00";
      const filters = {
        start: { _between: start + "," + end },
        // coachee: { _nnull: true },
        session_status: {
          _in: this.filters.session_status.map(({ option }) => option),
        },
        status: {
          _in: this.filters.status.map(({ option }) => option),
        },
        session_type: {
          _in: this.filters.session_type.map(({ option }) => option),
        },
      };
      if (this.selectedDate[1]) {
        axios
          .get("/items/appointments", {
            params: {
              fields:
                "*,coach.coach_id.id,coach.fullname,coach.display_image,coachee.id,coachee.first_name,coachee.last_name,coachee.data_token,project_code.title",
              access_token: this.token,
              filter: filters,
              sort: "start",
            },
          })
          .then((r) => {
            console.log('APPOIN',r.data.data);
            if (r.status === 200) {
              this.coachees_listed = r.data.data
                .map(({ coachee }) => coachee.data_token)
                .filter((n) => n);
              this.detokenizeBatch(this.coachees_listed, r.data.data);
            }
          });
      }
    },
    processSessions(d) {
      this.sessionsData = [];

      d.forEach((item) => {
        this.sessionsData.push({
          id: item.id,
          title: item.title,
          datetime: item.start,
          date: moment(item.start).format("dddd MMM Do YY"),
          time: moment(item.start).format("h:mm A"),
          project: item.project_code ? item.project_code.title : false,
          coachee: item.coachee.data_token
            ? this.getTokenValue("name", item.coachee.data_token)
            : item.coachee.first_name + " " + item.coachee.last_name,
          coach: item.coach.fullname,
          coach_image: item.coach.display_image,
          session_status: item.session_status,
          session_type: item.session_type,
        });
      });
    },
    detokenizeBatch(t, appointments_data) {
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
          this.processSessions(appointments_data);
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
