(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ab3fbb10"],{"129f":function(t,e){t.exports=Object.is||function(t,e){return t===e?0!==t||1/t===1/e:t!=t&&e!=e}},"14c3":function(t,e,n){var r=n("c6b6"),o=n("9263");t.exports=function(t,e){var n=t.exec;if("function"===typeof n){var i=n.call(t,e);if("object"!==typeof i)throw TypeError("RegExp exec method returned something other than an Object or null");return i}if("RegExp"!==r(t))throw TypeError("RegExp#exec called on incompatible receiver");return o.call(t,e)}},"25f0":function(t,e,n){"use strict";var r=n("6eeb"),o=n("825a"),i=n("d039"),c=n("ad6d"),a="toString",u=RegExp.prototype,s=u[a],l=i((function(){return"/a/b"!=s.call({source:"a",flags:"b"})})),f=s.name!=a;(l||f)&&r(RegExp.prototype,a,(function(){var t=o(this),e=String(t.source),n=t.flags,r=String(void 0===n&&t instanceof RegExp&&!("flags"in u)?c.call(t):n);return"/"+e+"/"+r}),{unsafe:!0})},"2c3e":function(t,e,n){var r=n("83ab"),o=n("9f7f").UNSUPPORTED_Y,i=n("9bf2").f,c=n("69f3").get,a=RegExp.prototype;r&&o&&i(RegExp.prototype,"sticky",{configurable:!0,get:function(){if(this!==a){if(this instanceof RegExp)return!!c(this).sticky;throw TypeError("Incompatible receiver, RegExp required")}}})},"466d":function(t,e,n){"use strict";var r=n("d784"),o=n("825a"),i=n("50c4"),c=n("1d80"),a=n("8aa5"),u=n("14c3");r("match",1,(function(t,e,n){return[function(e){var n=c(this),r=void 0==e?void 0:e[t];return void 0!==r?r.call(e,n):new RegExp(e)[t](String(n))},function(t){var r=n(e,t,this);if(r.done)return r.value;var c=o(t),s=String(this);if(!c.global)return u(c,s);var l=c.unicode;c.lastIndex=0;var f,p=[],d=0;while(null!==(f=u(c,s))){var g=String(f[0]);p[d]=g,""===g&&(c.lastIndex=a(s,i(c.lastIndex),l)),d++}return 0===d?null:p}]}))},"4d63":function(t,e,n){var r=n("83ab"),o=n("da84"),i=n("94ca"),c=n("7156"),a=n("9bf2").f,u=n("241c").f,s=n("44e7"),l=n("ad6d"),f=n("9f7f"),p=n("6eeb"),d=n("d039"),g=n("69f3").set,h=n("2626"),v=n("b622"),b=v("match"),x=o.RegExp,y=x.prototype,E=/a/g,m=/a/g,R=new x(E)!==E,w=f.UNSUPPORTED_Y,S=r&&i("RegExp",!R||w||d((function(){return m[b]=!1,x(E)!=E||x(m)==m||"/a/i"!=x(E,"i")})));if(S){var k=function(t,e){var n,r=this instanceof k,o=s(t),i=void 0===e;if(!r&&o&&t.constructor===k&&i)return t;R?o&&!i&&(t=t.source):t instanceof k&&(i&&(e=l.call(t)),t=t.source),w&&(n=!!e&&e.indexOf("y")>-1,n&&(e=e.replace(/y/g,"")));var a=c(R?new x(t,e):x(t,e),r?this:y,k);return w&&n&&g(a,{sticky:n}),a},_=function(t){t in k||a(k,t,{configurable:!0,get:function(){return x[t]},set:function(e){x[t]=e}})},I=u(x),U=0;while(I.length>U)_(I[U++]);y.constructor=k,k.prototype=y,p(o,"RegExp",k)}h("RegExp")},7156:function(t,e,n){var r=n("861d"),o=n("d2bb");t.exports=function(t,e,n){var i,c;return o&&"function"==typeof(i=e.constructor)&&i!==n&&r(c=i.prototype)&&c!==n.prototype&&o(t,c),t}},"841c":function(t,e,n){"use strict";var r=n("d784"),o=n("825a"),i=n("1d80"),c=n("129f"),a=n("14c3");r("search",1,(function(t,e,n){return[function(e){var n=i(this),r=void 0==e?void 0:e[t];return void 0!==r?r.call(e,n):new RegExp(e)[t](String(n))},function(t){var r=n(e,t,this);if(r.done)return r.value;var i=o(t),u=String(this),s=i.lastIndex;c(s,0)||(i.lastIndex=0);var l=a(i,u);return c(i.lastIndex,s)||(i.lastIndex=s),null===l?-1:l.index}]}))},"8aa5":function(t,e,n){"use strict";var r=n("6547").charAt;t.exports=function(t,e,n){return e+(n?r(t,e).length:1)}},9406:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"dashboard-container"},[n("div",{staticClass:"head"},[n("div",{staticStyle:{float:"left"}},[n("h4",[t._v("Easy Parcel")]),n("h6",[t._v(t._s(t.$t("m.title")))])]),n("div",{staticStyle:{float:"right","margin-top":"30px"}},[n("el-button",{attrs:{type:"primary"},on:{click:t.easyClick}},[t._v(t._s(t.$t("m.titleBottom")))])],1)]),n("config")],1)},o=[],i=(n("d3b7"),n("3ca3"),n("ddb0"),n("4d63"),n("ac1f"),n("2c3e"),n("25f0"),n("466d"),n("841c"),n("c24f")),c={name:"Dashboard",components:{config:function(){return n.e("chunk-e017d978").then(n.bind(null,"eb43"))},pushRecord:function(){return n.e("chunk-e32553a8").then(n.bind(null,"b329"))}},created:function(){var t=this,e=this.GetQueryString("appkey"),n=this.GetQueryString("handle"),r=this.GetQueryString("sign"),o=this.GetQueryString("code"),c=this.GetQueryString("timestamp"),a=this.GetQueryString("lang");localStorage.setItem("handle",n),a="zh-hans-cn"==a?"zh-CN":"en-US",localStorage.setItem("lang",a),this.$i18n.locale=a,o||Object(i["f"])({sign:r,handle:n}).then((function(t){console.log(t),200==t.code&&("link"==t.msg?window.location.href=t.data:console.log("token"))}));var u=n&&r&&o;u&&Object(i["e"])({appkey:e,sign:r,handle:n,timestamp:c,code:o}).then((function(e){200==e.code&&t.$message({message:e.msg,type:"success"})}))},mounted:function(){setTimeout((function(){window.addEventListener("storage",(function(t){console.log("111111111111111111111111111111111111111",t),"lang"==t.key&&console.log(t.newValue)}))}),1e3)},methods:{GetQueryString:function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),n=decodeURIComponent(window.location.search).substr(1).match(e);return console.log(decodeURIComponent(window.location.search)),null!=n?unescape(n[2]):null},easyClick:function(){window.open("https://easyparcel.com/")}}},a=c,u=(n("dfa5"),n("2877")),s=Object(u["a"])(a,r,o,!1,null,"44bd520a",null);e["default"]=s.exports},a09a:function(t,e,n){},d784:function(t,e,n){"use strict";n("ac1f");var r=n("6eeb"),o=n("d039"),i=n("b622"),c=n("9263"),a=n("9112"),u=i("species"),s=!o((function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")})),l=function(){return"$0"==="a".replace(/./,"$0")}(),f=i("replace"),p=function(){return!!/./[f]&&""===/./[f]("a","$0")}(),d=!o((function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var n="ab".split(t);return 2!==n.length||"a"!==n[0]||"b"!==n[1]}));t.exports=function(t,e,n,f){var g=i(t),h=!o((function(){var e={};return e[g]=function(){return 7},7!=""[t](e)})),v=h&&!o((function(){var e=!1,n=/a/;return"split"===t&&(n={},n.constructor={},n.constructor[u]=function(){return n},n.flags="",n[g]=/./[g]),n.exec=function(){return e=!0,null},n[g](""),!e}));if(!h||!v||"replace"===t&&(!s||!l||p)||"split"===t&&!d){var b=/./[g],x=n(g,""[t],(function(t,e,n,r,o){return e.exec===c?h&&!o?{done:!0,value:b.call(e,n,r)}:{done:!0,value:t.call(n,e,r)}:{done:!1}}),{REPLACE_KEEPS_$0:l,REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE:p}),y=x[0],E=x[1];r(String.prototype,t,y),r(RegExp.prototype,g,2==e?function(t,e){return E.call(t,this,e)}:function(t){return E.call(t,this)})}f&&a(RegExp.prototype[g],"sham",!0)}},dfa5:function(t,e,n){"use strict";n("a09a")}}]);