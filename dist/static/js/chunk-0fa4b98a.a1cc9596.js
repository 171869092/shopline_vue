(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0fa4b98a"],{a75e:function(t,e,a){"use strict";a("fe99")},b329:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"pushbox"},[a("div",{staticClass:"tableBox"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,border:""}},[a("el-table-column",{attrs:{prop:"order_id",label:"订单号",width:"300"}}),a("el-table-column",{attrs:{prop:"msg",label:"状态",width:"100"}}),a("el-table-column",{attrs:{prop:"push_time",label:"推送时间",width:"200"}}),a("el-table-column",{attrs:{prop:"params",label:"推送参数"}})],1),a("pagination",{attrs:{total:t.total,page:t.listQuery.page,limit:t.listQuery.limit},on:{"update:page":function(e){return t.$set(t.listQuery,"page",e)},"update:limit":function(e){return t.$set(t.listQuery,"limit",e)},pagination:t.Inquire}})],1)])},l=[],n=(a("d3b7"),a("3ca3"),a("ddb0"),a("c24f")),r={name:"pushRecord",components:{Pagination:function(){return a.e("chunk-6672d7d3").then(a.bind(null,"333d"))}},data:function(){return{listQuery:{limit:10,page:0},tableData:[],total:0}},created:function(){this.Inquire()},methods:{Inquire:function(){var t=this,e={handle:localStorage.getItem("handle"),page:(this.listQuery.page-1)*this.listQuery.limit,limit:this.listQuery.limit};Object(n["d"])(e).then((function(e){200==e.code&&(t.tableData=e.data,t.total=e.count)}))}}},u=r,s=(a("a75e"),a("2877")),o=Object(s["a"])(u,i,l,!1,null,"6eb9d504",null);e["default"]=o.exports},fe99:function(t,e,a){}}]);