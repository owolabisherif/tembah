async function i(t){try{const r=await(await fetch(t)).blob();let e=t.split("/"),a=e&&e.length?e[e.length-1]:"";return new File([r],`${a}`,{type:r.type})}catch{return t}}export{i as u};
