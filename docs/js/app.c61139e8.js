(function(t){function e(e){for(var r,a,c=e[0],s=e[1],u=e[2],d=0,f=[];d<c.length;d++)a=c[d],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&f.push(o[a][0]),o[a]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(t[r]=s[r]);l&&l(e);while(f.length)f.shift()();return i.push.apply(i,u||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],r=!0,c=1;c<n.length;c++){var s=n[c];0!==o[s]&&(r=!1)}r&&(i.splice(e--,1),t=a(a.s=n[0]))}return t}var r={},o={app:0},i=[];function a(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=t,a.c=r,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)a.d(n,r,function(e){return t[e]}.bind(null,r));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],s=c.push.bind(c);c.push=e,c=c.slice();for(var u=0;u<c.length;u++)e(c[u]);var l=s;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";var r=n("64a9"),o=n.n(r);o.a},"14fe":function(t,e,n){"use strict";var r=n("3cab"),o=n.n(r);o.a},"24e4":function(t,e,n){},"36f7":function(t,e,n){},"3cab":function(t,e,n){},4870:function(t,e,n){"use strict";var r=n("36f7"),o=n.n(r);o.a},"56d7":function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var r=n("2b0e"),o=n("bc3a"),i=n.n(o),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("Deck",{attrs:{msg:"banana"}})],1)},c=[],s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"deck"},[t.loading?n("loader"):n("vue-swing",{ref:"vueswing",staticClass:"vueswing",attrs:{config:t.config},on:{throwout:t.onThrowout}},t._l(t.cards,(function(t,e){return n("div",{key:t.title,staticClass:"card"},[n("card",{key:t.title,attrs:{index:e,title:t.title,imageURL:t.picture_path,description:t.description}})],1)})),0),n("div",{staticClass:"bottom-bar"},[n("transition",{attrs:{name:"slide-fade"}},[t.hiddenCards.length?n("div",{staticClass:"back-button",on:{click:t.undo}}):t._e()])],1)],1)},u=[],l=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"card__container"},[n("img",{staticClass:"card__image",attrs:{src:t.patchURL(t.imageURL)}}),n("h1",{staticClass:"card__title"},[t._v(t._s(t.title))]),n("div",{staticClass:"card__description",domProps:{innerHTML:t._s(t.description)}})])},d=[],f=(n("f559"),{name:"Card",props:{title:String,imageURL:String,description:String},methods:{patchURL:function(t){return t.startsWith("./")?"//cadesalaberry.github.io/lucky-you/"+t:t}}}),p=f,h=(n("a183"),n("2877")),g=Object(h["a"])(p,l,d,!1,null,"a04a870a",null),v=g.exports,b=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"spinner"})},m=[],y={name:"Loader"},_=y,w=(n("4870"),Object(h["a"])(_,b,m,!1,null,"eca9c34a",null)),C=w.exports,k=n("634d"),O={name:"Deck",props:{subtitle:String},components:{VueSwing:k["a"],Loader:C,Card:v},data:function(){return{config:{allowedDirections:[k["a"].Direction.LEFT,k["a"].Direction.RIGHT],rotation:function(t,e,n,r){return Math.min(t/20,r)},throwOutConfidence:function(t,e,n){var r=Math.min(1.7*Math.abs(t)/n.offsetWidth,1),o=Math.min(1.7*Math.abs(e)/n.offsetHeight,1);return Math.max(r,o)}},loading:!0,cards:[],hiddenCards:[]}},mounted:function(){this.$http.get("//cadesalaberry.github.io/lucky-you/content.json").then(this.replaceCards).catch((function(t){throw console.error("Eror getting content"),t}))},methods:{replaceCards:function(t){this.cards=t.data.categories[0].cards,this.loading=!1},add:function(){console.log("add",this.$refs)},undo:function(){var t=this.hiddenCards.pop();t&&this.cards.push(t)},onThrowout:function(t){var e=t.target;t.throwDirection;console.log("Threw out ".concat(e.textContent,"!"));var n=this.cards.pop();n&&this.hiddenCards.push(n)}}},j=O,x=(n("14fe"),Object(h["a"])(j,s,u,!1,null,"4177be6b",null)),M=x.exports,S={name:"App",components:{Deck:M}},L=S,T=(n("034f"),Object(h["a"])(L,a,c,!1,null,null,null)),P=T.exports,$=n("9483");Object($["a"])("".concat("","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},cached:function(){console.log("Content has been cached for offline use.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(t){console.error("Error during service worker registration:",t)}}),r["a"].config.productionTip=!1,r["a"].prototype.$http=i.a,new r["a"]({render:function(t){return t(P)}}).$mount("#app")},"64a9":function(t,e,n){},a183:function(t,e,n){"use strict";var r=n("24e4"),o=n.n(r);o.a}});
//# sourceMappingURL=app.c61139e8.js.map