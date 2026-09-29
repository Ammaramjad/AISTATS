export interface RoadNode { id:string; x:number; z:number }
export const nodes: RoadNode[] = [
  {id:'airport',x:-86,z:22},{id:'west',x:-58,z:22},{id:'park',x:-30,z:22},{id:'center',x:0,z:22},{id:'xinyi',x:32,z:22},{id:'tower',x:66,z:22},
  {id:'northwest',x:-58,z:-22},{id:'north',x:-30,z:-22},{id:'station',x:0,z:-22},{id:'east',x:32,z:-22},{id:'hotel',x:66,z:-22}
];
export const edges = [['airport','west'],['west','park'],['park','center'],['center','xinyi'],['xinyi','tower'],['west','northwest'],['northwest','north'],['north','station'],['station','east'],['east','hotel'],['park','north'],['center','station'],['xinyi','east'],['tower','hotel']] as const;
const byId = new Map(nodes.map(n=>[n.id,n]));
export function route(start:string,end:string):RoadNode[] {
  const queue=[[start]]; const seen=new Set([start]);
  while(queue.length){ const path=queue.shift()!; const last=path.at(-1)!; if(last===end)return path.map(id=>byId.get(id)!); for(const e of edges){const next=e[0]===last?e[1]:e[1]===last?e[0]:null;if(next&&!seen.has(next)){seen.add(next);queue.push([...path,next]);}} }
  return [];
}
export function routeDistance(path:RoadNode[]){ return path.slice(1).reduce((sum,n,i)=>sum+Math.hypot(n.x-path[i].x,n.z-path[i].z),0)*0.32; }
