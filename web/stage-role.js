/* Run before body paint: projection role always hides all operator controls. */
'use strict';
(()=>{const token=new URLSearchParams(location.hash.slice(1)).get('stage');const remote=typeof token==='string'&&/^[a-f0-9]{32}$/.test(token);window.HalloweenStageRole=Object.freeze({remote,token:remote?token:null});if(remote)document.documentElement.dataset.stage='remote';})();
