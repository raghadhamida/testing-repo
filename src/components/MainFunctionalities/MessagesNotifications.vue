<template>
  <Message>{{msg}}<br />
      <Button
        label="Update Availabilities"
        icon="pi pi-calendar"
        iconPos="left"
        class="p-button-sm mt-2"
      />
    </Message>''
</template>

<script>

import Message from "primevue/message";
import Button from "primevue/button";

export default {

    props:{
        msg:String
    },
    components:{
        Message,
        Button
    }
}
</script>

<style>

</style>