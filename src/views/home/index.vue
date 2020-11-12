<template>
  <div>
    <header>
      <nav class="navbar navbar-expand-md fixed-top s-navbar navbar-light white-bg shadow-sm">
        <div class="container">
          <a class="navbar-brand" href="#">DropShipping</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon" />
          </button>
          <div id="navbarCollapse" class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
              <li v-for="(menu, key) in menuList" :key="key" class="nav-item" :class="{'active': activeIndex == key}" @click="goLink(key)">
                <a class="nav-link" href="#">{{ menu }}</a>
              </li>
            </ul>
            <form class="form-inline mt-2 mt-md-0">
              <span class="login-btn" @click="loginClick">LOGIN</span>
              <button type="button" class="btn btn-lg s-btn" @click="registerClick">Get Started</button>
            </form>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <section class="wap m-navbar-top">
        <div class="jumbotron">
          <div class="container">
            <h1 class="display-4">Hello, world!</h1>
            <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
            <hr class="my-4">
            <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
            <a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
          </div>
        </div>
      </section>
      <section class="marketing">
        <div class="container">
          <h2 class="text-center p-5">What is DropShipping?</h2>
          <!-- Three columns of text below the carousel -->
          <div class="row mb-5">
            <div class="col-lg-3 text-center">
              <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
              <h3 class="title mt-4">Heading</h3>
            </div>
            <div class="col-lg-3 text-center">
              <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
              <h3 class="title mt-4">Heading</h3>
            </div>
            <div class="col-lg-3 text-center">
              <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
              <h3 class="title mt-4">Heading</h3>
            </div>
            <div class="col-lg-3 text-center">
              <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
              <h3 class="title mt-4">Heading</h3>
            </div>
          </div><!-- /.row -->
        </div>
      </section>

      <section class="pink-bg">
        <div class="container">
          <h2 class="text-center p-5">What can you do in DropShipping?</h2>
          <div class="row pb-5">
            <div class="col-lg-3 text-center" v-for="(item,idx) in threeList" :key="idx">
              <img :src="item.image">
              <h5 class="title mt-4">{{item.name}}</h5>
            </div>
          </div>
        </div>
      </section>

      <section class="container">
        <!-- START THE FEATURETTES -->

        <hr class="featurette-divider">

        <div class="row featurette">
          <div class="col-md-7">
            <h2 class="featurette-heading">First featurette heading. <span class="text-muted">It’ll blow your mind.</span></h2>
            <p class="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
          </div>
          <div class="col-md-5">
            <!-- <svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 500x500"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee" /><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg> -->
            <img src="https://cdn.shopifycdn.net/shopifycloud/brochure/assets/home/help@mobile-d425d91a15904a11c2c968cbc5d0365bc1db3ddb0b3c1e6d8582fa9138178084.jpg" style="width:100%" alt="" srcset="">
          </div>
        </div>

        <hr class="featurette-divider">

        <div class="row featurette">
          <div class="col-md-7 order-md-2">
            <h2 class="featurette-heading">Oh yeah, it’s that good. <span class="text-muted">See for yourself.</span></h2>
            <p class="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
          </div>
          <div class="col-md-5 order-md-1">
            <!-- <svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 500x500"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee" /><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg> -->
            <img src="https://cdn.shopifycdn.net/shopifycloud/brochure/assets/merchants/cee-cees-closet/cee-cees-closet-testimonial@mobile-2x-fa815a517c766bed8fd29b4a720f163c6266ee3e4b2218fd80d5a32ceeb0ade3.jpg" style="width:100%" alt="" srcset="">
          </div>
        </div>

        <hr class="featurette-divider">

        <div class="row featurette">
          <div class="col-md-7">
            <h2 class="featurette-heading">And lastly, this one. <span class="text-muted">Checkmate.</span></h2>
            <p class="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
          </div>
          <div class="col-md-5">
            <!-- <svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 500x500"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee" /><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg> -->
            <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=151497144,3503796435&fm=26&gp=0.jpg" style="width:100%" alt="" srcset="">
          </div>
        </div>

        <hr class="featurette-divider">

        <!-- /END THE FEATURETTES -->

      </section>
    </main>
    <footer class="b-footer">
      <div class="container">
        <p class="float-right">
          <a href="#">Back to top</a>
        </p>
        <p>Album example is © Bootstrap, but please download and customize it for yourself!</p>
        <p>New to Bootstrap? <a href="https://v4.bootcss.com/">Visit the homepage</a> or read our <a href="/docs/getting-started/introduction/">getting started guide</a>.</p>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: 0,
      menuList: ['HOME', 'FAQ', 'CONTACT'],
      threeList:[
        {image:'https://cdn.shopifycdn.net/shopifycloud/brochure/assets/merchants/alfred/home-example-small-4bc93b93a9d345329480ea6e387cf6890323170a70473bad69a87424cad52e28.jpg',name:'Find winning dropshipping products'},
        {image:'https://cdn.shopifycdn.net/shopifycloud/brochure/assets/merchants/corey-moranis/home-example-small-6cf57deaaf9e7c38f45de3d300080353843430c1be3ab0ed3cd5e21b93157de8.jpg',name:'Try the products yourself'},
        {image:'https://cdn.shopifycdn.net/shopifycloud/brochure/assets/merchants/then-i-met-you/home-example-small-873ea125aea32650f2e2c282609c62a63be928583b8830cc67df98feff30ca89.jpg',name:'Connect your online store with ease'},
        {image:'https://cdn.shopifycdn.net/shopifycloud/brochure/assets/merchants/miss-boon/home-example-small-8bb452f93af6069b33cdc00d9fab7cacaa32d34684bda58e13eb25faadeb2b72.jpg',name:'Discover dropshipping suppliers with fast shipping'}
      ]
    }
  },
  methods: {
    goLink(index) {
      this.activeIndex = index
    },
    loginClick() {
      this.$router.push({ name: 'login' })
    },
    registerClick() {
      this.$router.push({ name: 'register' })
    },
    handleSelect() {

    }
  }
}
</script>
