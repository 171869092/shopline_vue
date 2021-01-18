<template>
     <footer class="b-footer">
      <div class="container">
        <p class="float-right">
          <a href="#">Back to top</a>
        </p>
         <p class="float-left">
          <span @click="policyClick">Privacy Policy</span>
        </p>
        <p>Album example is © Bootstrap, but please download and customize it for yourself!</p>
        <p>New to Bootstrap? <a href="https://v4.bootcss.com/">Visit the homepage</a> or read our <a href="/docs/getting-started/introduction/">getting started guide</a>.</p>
      </div>
    </footer>
</template>
<script>
export default {
  name: 'BFooter',
  props: {},
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
     policyClick(){
      this.$router.push({ name: 'privacy-policy' })
    }
  }
}
</script>
<style scoped>
</style>
