'use strict';
window.HalloweenWindowSafety=Object.freeze({accentMs:3000,holdMs:8000,heartbeatMs:1800,renderMs:1500,
 surface(win=window,doc=document){const width=win.outerWidth,height=win.outerHeight,small=width<240||height<140;return {available:!doc.hidden&&!small,browserVisible:!doc.hidden,outer:[width,height],reason:doc.hidden?'窓が非表示':small?'窓が最小化または小さすぎます':''};}
});
