<template>
  <div>
    <header>
      <nav class="navbar navbar-expand-md fixed-top s-navbar navbar-light white-bg">
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
              <span class="login-btn" @click="loginclick">LOGIN</span>
              <button type="button" class="btn btn-lg s-btn">Get Started</button>
            </form>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <section class="wap">
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
      <div class="marketing">
        <section>
          <h2 class="text-center mb-5">What is DropShipping?</h2>
          <!-- Three columns of text below the carousel -->
          <div class="row mb-5">
            <div class="col-lg-3 text-center">
              <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
              <h3>Heading</h3>
            </div>
            <div class="col-lg-3 text-center">
              <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
              <h3>Heading</h3>
            </div>
            <div class="col-lg-3 text-center">
              <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
              <h3>Heading</h3>
            </div>
            <div class="col-lg-3 text-center">
              <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
              <h3>Heading</h3>
            </div>
          </div><!-- /.row -->
        </section>

        <section class="pink-bg">
          <div class="container ">
            <h2 class="text-center mb-5">What can you do in DropShipping?</h2>
            <div class="row mb-5">
              <div class="col-lg-3 text-center">
                <svg class="bd-placeholder-img card-img-top" width="210" height="144" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="38%" y="50%" fill="#eceeef">Thumbnail</text></svg>
                <h3>Find winning dropshipping products</h3>
              </div>
              <div class="col-lg-3 text-center">
                <svg class="bd-placeholder-img card-img-top" width="210" height="144" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="38%" y="50%" fill="#eceeef">Thumbnail</text></svg>
                <h3>Try the products yourself</h3>
              </div>
              <div class="col-lg-3 text-center">
                <svg class="bd-placeholder-img card-img-top" width="210" height="144" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="38%" y="50%" fill="#eceeef">Thumbnail</text></svg>
                <h3>Connect your online store with ease</h3>
              </div>
              <div class="col-lg-3 text-center">
                <svg class="bd-placeholder-img card-img-top" width="210" height="144" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="38%" y="50%" fill="#eceeef">Thumbnail</text></svg>
                <h3>Discover dropshipping suppliers with fast shipping</h3>
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
              <svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 500x500"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee" /><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>
            </div>
          </div>

          <hr class="featurette-divider">

          <div class="row featurette">
            <div class="col-md-7 order-md-2">
              <h2 class="featurette-heading">Oh yeah, it’s that good. <span class="text-muted">See for yourself.</span></h2>
              <p class="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
            </div>
            <div class="col-md-5 order-md-1">
              <svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 500x500"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee" /><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>
            </div>
          </div>

          <hr class="featurette-divider">

          <div class="row featurette">
            <div class="col-md-7">
              <h2 class="featurette-heading">And lastly, this one. <span class="text-muted">Checkmate.</span></h2>
              <p class="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
            </div>
            <div class="col-md-5">
              <svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 500x500"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee" /><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>
            </div>
          </div>

          <hr class="featurette-divider">

        <!-- /END THE FEATURETTES -->

        </section>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: 0,
      menuList: ['HOME', 'FAQ', 'CONTACT']
    }
  },
  methods: {
    goLink(index) {
      this.activeIndex = index
    },
    loginclick() {
      this.$router.push({ name: 'login' })
    },
    handleSelect() {

    }
  }
}
</script>
<style lang="scss" scoped>

</style>
