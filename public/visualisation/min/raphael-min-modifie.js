!function(){"use strict";Treemap.draw=function(){function n(n){return n&&n.constructor===Array}function r(n){return n&&n.constructor===Function}function e(n,r){var e;for(e in r)r.hasOwnProperty(e)&&(n[e]=r[e]);return n}function t(r,e,o,a,f){var i,u,l,c;if(n(e[0][0]))for(i=0;i<e.length;i++)l=f.slice(),l.push(i),t(r,e[i],o,a,l);else for(i=0;i<e.length;i++){for(l=f.slice(),l.push(i),c=o,u=0;u<l.length;u++)c=c[l[u]];a.draw(e[i],c,l)}}function o(o,a,f,i,u,l){var c,b,h,d,s;l="undefined"==typeof l?[]:l,d=function(){function r(e){var t,o=0;if(n(e[0]))for(t=0;t<e.length;t++)o+=r(e[t]);else for(t=0;t<e.length;t++)o+=e[t].length;return o}function e(r){var t,o=0;if(n(r[0]))for(t=0;t<r.length;t++)o+=e(r[t]);else for(t=0;t<r.length;t++)o+=1;return o}function t(n,r){var e=n*r,t=Math.pow(e,.5);return Math.min(t/a,20)}function o(n,r){return{fill:"#FCFCFC","font-size":t(n[2]-n[0],n[3]-n[1])}}var a=r(u)/e(u);return o}();var g=function(n,r){var e=["hsb(0,1,0.4)","hsb(0.2,1,0.4)","hsb(0.4,1,0.4)","hsb(0.6,1,0.4)","hsb(0.8,1,0.4)"],t=1===r.length?e[2]:e[(r[0]+2)%5];return{stroke:"FEFEFE",fill:t}};s=function(){function n(n,t,o){var a,f,i,u,b,h=n[0],s=n[1],p=n[2],v=n[3];a=c.rect(h,s,p-h,v-s),i=r(l.box)?l.box(n,o):l.box,i=e(g(n,o),i),"fill-opacity"in i&&(b=Raphael.getRGB(i.fill),b.error||(i.fill="rgba("+b.r+","+b.g+","+b.b+","+i["fill-opacity"]+")")),a.attr(i),f=c.text((h+p)/2,(s+v)/2,t),u=r(l.label)?l.label(n,o):l.label,u=e(d(n,o),u),f.attr(u),f.getBBox().width>p-h&&f.getBBox().width<=v-s&&f.rotate(-90)}return n}(),l.background="undefined"==typeof l.background?{}:l.background,l.label="undefined"==typeof l.label?{}:l.label,l.box="undefined"==typeof l.box?{}:l.box,l.draw="undefined"==typeof l.draw?s:l.draw,c=new Raphael(o,a,f),b=c.rect(0,0,a,f),b.attr(l.background),h=Treemap.generate(sizesArray,a,f),t(c,h,u,l,[])}return o}()}();