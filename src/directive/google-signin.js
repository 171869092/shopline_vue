/* eslint-disable no-undef */

import Vue from 'vue'

export default Vue.directive('google-signin-button', {
  // eslint-disable-next-line space-before-function-paren
  bind: function (el, binding, vnode) {
    CheckComponentMethods()
    const clientId = binding.value
    const googleSignInAPI = document.createElement('script')
    googleSignInAPI.setAttribute('src', 'https://apis.google.com/js/api:client.js')
    document.head.appendChild(googleSignInAPI)

    googleSignInAPI.onload = InitGoogleButton

    function InitGoogleButton() {
      gapi.load('auth2', () => {
        const auth2 = gapi.auth2.init({
          client_id: clientId,
          cookiepolicy: 'single_host_origin'
          // ux_mode: 'redirect'
        })
        auth2.attachClickHandler(el, {},
          OnSuccess,
          Onfail
        )
      })
    }
    function OnSuccess(googleUser) {
      vnode.context.OnGoogleAuthSuccess(googleUser.getAuthResponse().id_token)
      googleUser.disconnect()
    }
    function Onfail(error) {
      vnode.context.OnGoogleAuthFail(error)
    }
    function CheckComponentMethods() {
      if (!vnode.context.OnGoogleAuthSuccess) {
        throw new Error('The method OnGoogleAuthSuccess must be defined on the component')
      }

      if (!vnode.context.OnGoogleAuthFail) {
        throw new Error('The method OnGoogleAuthFail must be defined on the component')
      }
    }
  }
})
