export const bytes=(n=0)=>{if(n<1024)return `${n} B`;const u=['KB','MB','GB','TB'];let i=-1,v=n;do{v/=1024;i++}while(v>=1024&&i<u.length-1);return `${v.toFixed(v>=100?0:v>=10?1:2)} ${u[i]}`};
export const date=(s?:string|null)=>s?new Date(s).toLocaleString([], {dateStyle:'medium',timeStyle:'short'}):'—';
