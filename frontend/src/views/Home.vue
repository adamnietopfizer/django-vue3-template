<template>
  <div class="container mx-auto">
    <img class="mx-auto" alt="Vue logo" src="../assets/logo.png" />
    <Quote msg="Seize the day" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Quote from "@/components/Quote.vue";
@Options({
  components: {
    Quote
  }
})
export default class Home extends Vue {}
</script>
