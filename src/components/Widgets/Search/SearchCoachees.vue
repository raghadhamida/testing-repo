<template lang="">
  <div>
    <InputText
      type="text"
      v-model="value"
      class="ml-2 text-sm w-22rem border-round-3xl"
      @input="filterCoachees($event)"
      placeholder="Search by Coachee Name, Coach or Project .."
    />
  </div>
</template>
<script>
import InputText from "primevue/inputtext";
export default {
  emits: ["filteredCoacheesData", "resetFilteredData"],
  props: {
    data: Array,
  },
  data() {
    return {
      value: null,
    };
  },
  components: {
    InputText,
  },
  methods: {
    filterCoachees(e) {
      console.log(this.value);
      if (this.data.length > 1 && this.value.length >= 2) {
        let results = {
          coachee: this.data.filter((d) =>
            d.coacheeName.toString().toLowerCase().includes(e.target.value)
          ),
          coacheeTokenized: this.data.filter((d) =>
            d.coacheeTokenized.toString().toLowerCase().includes(e.target.value)
          ),
          project: this.data.filter((d) =>
            d.project.toString().toLowerCase().includes(e.target.value)
          ),
          coach: this.data.filter((d) =>
            d.coachName.toString().toLowerCase().includes(e.target.value)
          ),
        };
        const combined_results = [
          ...results.coachee,
          ...results.project,
          ...results.coach,
          ...results.coacheeTokenized
        ];

        this.$emit("filteredCoacheesData", {
          filteredCoachees: combined_results,
        });
      } else {
        this.$emit("resetFilteredData");
      }
      // console.log(e.target.value)
    },
  },
};
</script>
<style lang=""></style>
