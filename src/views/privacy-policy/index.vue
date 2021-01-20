<template>
  <div>
    <navbar />
    <main>
      <section class="wap wap-top">
        <div class="privacy-banner">
          <div class="container">
            <h1 class="title is-1">Privacy Policy</h1>
          </div>
        </div>
      </section>
      <section class="wap wap-top">
        <div class="container">
          <h3 class="title">FbAli Privacy Policy</h3>
          <div class="block">
            <p class="block-title">
              FbAli provides lightweight ERP including product management, orders management and shipping management, and auto-processing for orders to merchants who use Shopify to power their stores. This Privacy Policy describes how personal information is collected, used, and shared when you install or use the App in connection with your Shopify-supported store.
            </p>
          </div>
        </div>
      </section>
      <section class="wap wap-top">
        <div class="container">
          <h3 class="title">Personal Information the App Collects</h3>
          <div class="block">
            <p class="block-title">
              When you install the App, we are automatically able to access certain types of information from your Shopify account: products, orders, shipping and fulfillments and setting information.
            </p>
            <p class="block-title">
              Additionally, we collect the following types of personal information from you and/or your customers once you have installed the App: Information about you and others who may access the App on behalf of your store, such as your name, address, email address, phone number, and billing information; Information about individuals who visit your store, such as their IP address, web browser details, time zone, and information about the cookies installed on the particular device.

            </p>
            <p class="block-title">
              We collect personal information directly from the relevant individual, through your Shopify account, or using the following technologies: “Cookies” are data files that are placed on your device or computer and often include an anonymous unique identifier. For more information about cookies, and how to disable cookies, visit<a href="https://www.allaboutcookies.org" target="_blank" class="primary">www.allaboutcookies.org.</a> “Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps. “Web beacons,” “tags,” and “pixels” are electronic files used to record information about how you browse the Site.
            </p>
          </div>
        </div>
      </section>
      <section class="wap wap-top">
        <div class="container">
          <h3 class="title">How Do We Use Your Personal Information?</h3>
          <div class="block">
            <p class="block-title">
              We use the personal information we collect from you and your customers in order to provide the Service and to operate the App. Additionally, we use this personal information to: Communicate with you; Optimize or improve the App; and Provide you with information or advertising relating to our products or services. Also we will pass orders information to your selected sourcing agent.
            </p>
          </div>
        </div>
      </section>
      <section class="wap wap-top">
        <div class="container">
          <h3 class="title">Sharing Your Personal Information</h3>
          <div class="block">
            <p class="block-title">
              Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
            </p>
            <p class="block-title">
              Your Rights If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
            </p>
            <p class="block-title">
              Additionally, if you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information will be transferred outside of Europe, including to Canada and the United States.
            </p>
            <p class="block-title">
              Data Retention When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
            </p>
            <p class="block-title">
              Changes We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.
            </p>
          </div>
        </div>
      </section>
      <section class="wap wap-top">
        <div class="container">
          <h3 class="title">Contacting</h3>
          <div class="block">
            <p class="block-title">
              Contact Us For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at fulfilbyali@gmail.com or by mail using the details provided below:
            </p>
          </div>
        </div>
      </section>
    </main>
    <footer-home />
  </div>
</template>
<script>
import Navbar from '@/views/home/components/navbar'
import footerHome from '@/views/home/components/footer'
export default {
  name: 'privacy-policy',
  components: {
    Navbar,
    footerHome
  },
  props: {},
  data() {
    return {
    }
  },
  computed: {
  },
  created() {},
  methods: {
  }
}
</script>
<style scoped>
.privacy-banner{
  background: #f28c60;
  height: 490px;
  /* margin-top: -80px; */
}
.title{
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.is-1{
  font-size: 3rem;
  color: #fff;
  line-height: 410px;
  text-align: center;
}
.wap-top{
  margin-top: 80px;
}
.block{
  margin-bottom: 1.5rem;
}
.block-title{
  color: #4a4a4a;
    font-size: 1em;
    font-weight: 400;
    line-height: 1.5;
}
</style>
