(function(e){function n(n){for(var r,o,l=n[0],u=n[1],c=n[2],s=0,p=[];s<l.length;s++)o=l[s],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&p.push(i[o][0]),i[o]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);f&&f(n);while(p.length)p.shift()();return a.push.apply(a,c||[]),t()}function t(){for(var e,n=0;n<a.length;n++){for(var t=a[n],r=!0,l=1;l<t.length;l++){var u=t[l];0!==i[u]&&(r=!1)}r&&(a.splice(n--,1),e=o(o.s=t[0]))}return e}var r={},i={app:0},a=[];function o(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=e,o.c=r,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)o.d(t,r,function(n){return e[n]}.bind(null,r));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="/projects/lifecounter/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],u=l.push.bind(l);l.push=n,l=l.slice();for(var c=0;c<l.length;c++)n(l[c]);var f=u;a.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},"034f":function(e,n,t){"use strict";var r=t("64a9"),i=t.n(r);i.a},"56d7":function(e,n,t){"use strict";t.r(n);t("cadf"),t("551c"),t("f751"),t("097d");var r=t("2b0e"),i=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},e._l(e.players,function(e){return t("PlayerLife",{key:e.id,attrs:{player:e}})}),1)},a=[],o=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"player-life"},[t("div",[e.editingName?e._e():t("p",{staticClass:"name",on:{click:function(n){return e.editName()}}},[e._v(e._s(e.player.name))]),e.editingName?t("input",{directives:[{name:"model",rawName:"v-model",value:e.player.name,expression:"player.name"}],ref:"playername",domProps:{value:e.player.name},on:{blur:function(n){return e.hideEditName()},keyup:function(n){return!n.type.indexOf("key")&&e._k(n.keyCode,"enter",13,n.key,"Enter")?null:e.hideEditName()},input:function(n){n.target.composing||e.$set(e.player,"name",n.target.value)}}}):e._e(),t("p",{staticClass:"life"},[e._v(e._s(e.player.life))]),t("div",{staticClass:"life-btn",attrs:{id:"minus5"},on:{click:function(n){return e.changeLife(e.player,-5)}}},[e._v("-5")]),t("div",{staticClass:"life-btn",attrs:{id:"minus1"},on:{click:function(n){return e.changeLife(e.player,-1)}}},[e._v("-1")]),t("div",{staticClass:"life-btn",attrs:{id:"plus1"},on:{click:function(n){return e.changeLife(e.player,1)}}},[e._v("+1")]),t("div",{staticClass:"life-btn",attrs:{id:"plus5"},on:{click:function(n){return e.changeLife(e.player,5)}}},[e._v("+5")])])])},l=[],u={name:"PlayerLife",props:["player"],methods:{changeLife:function(e,n){e.life+=n},editName:function(){var e=this;this.editingName=!0,this.$nextTick(function(){e.$refs.playername.focus()})},hideEditName:function(){this.editingName=!1}},data:function(){return{editingName:!1}}},c=u,f=(t("63e1"),t("2877")),s=Object(f["a"])(c,o,l,!1,null,"9d35a4a0",null),p=s.exports,d={name:"app",components:{PlayerLife:p},data:function(){return{players:[{id:1,name:"P1",life:20},{id:2,name:"P2",life:20}]}}},y=d,m=(t("034f"),Object(f["a"])(y,i,a,!1,null,null,null)),v=m.exports;r["a"].config.productionTip=!1,new r["a"]({render:function(e){return e(v)}}).$mount("#app")},"5b5f":function(e,n,t){},"63e1":function(e,n,t){"use strict";var r=t("5b5f"),i=t.n(r);i.a},"64a9":function(e,n,t){}});
//# sourceMappingURL=app.4c5df47e.js.map