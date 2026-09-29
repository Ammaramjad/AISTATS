import * as THREE from 'three';
import type { BookingState } from './booking-store';
import { places, vehicles } from './catalog';
import { edges, nodes, route } from './road-network';

const nodeMap=new Map(nodes.map(n=>[n.id,n]));
export class CityScene {
  private renderer:THREE.WebGLRenderer; private scene=new THREE.Scene(); private camera:THREE.PerspectiveCamera;
  private routeLine?:THREE.Line; private car?:THREE.Group; private carPath:THREE.Vector3[]=[]; private moveCar=false; private markerGroup=new THREE.Group(); private raf=0; private reduced=false;
  private targetPos=new THREE.Vector3(44,47,73); private lookAt=new THREE.Vector3(0,0,6); private clock=new THREE.Clock();
  constructor(private canvas:HTMLCanvasElement){
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'}); this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.65)); this.renderer.shadowMap.enabled=true; this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.camera=new THREE.PerspectiveCamera(43,1,.5,350); this.camera.position.copy(this.targetPos); this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.scene.background=new THREE.Color(0x07100f); this.scene.fog=new THREE.Fog(0x07100f,105,205); this.scene.add(new THREE.HemisphereLight(0xb7d7d0,0x17231f,2.4));
    const sun=new THREE.DirectionalLight(0xffdfb4,4.2);sun.position.set(-35,70,15);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-110,right:110,top:90,bottom:-90});sun.shadow.bias=-.0003;this.scene.add(sun);
    this.buildWorld(); addEventListener('resize',()=>this.resize());this.resize();this.animate();
  }
  private mat(color:number,rough=.72,metal=.08){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal})}
  private box(w:number,h:number,d:number,color:number){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),this.mat(color));m.position.y=h/2;m.castShadow=m.receiveShadow=true;return m}
  private buildWorld(){
    const ground=this.box(220,.4,120,0x13211d);ground.position.y=-.24;this.scene.add(ground);
    const roadMat=this.mat(0x252c2b,.92,0); const walkMat=this.mat(0x66716b,.95,0);
    for(const [a,b] of edges){const p=nodeMap.get(a)!,q=nodeMap.get(b)!;const horizontal=p.z===q.z;const len=Math.hypot(q.x-p.x,q.z-p.z);const curb=new THREE.Mesh(new THREE.BoxGeometry(horizontal?len+5:13,.3,horizontal?13:len+5),walkMat);curb.position.set((p.x+q.x)/2,.06,(p.z+q.z)/2);curb.receiveShadow=true;this.scene.add(curb);const road=new THREE.Mesh(new THREE.BoxGeometry(horizontal?len+5:10,.12,horizontal?10:len+5),roadMat);road.position.set((p.x+q.x)/2,.25,(p.z+q.z)/2);road.receiveShadow=true;this.scene.add(road);const stripe=new THREE.Mesh(new THREE.BoxGeometry(horizontal?len:0.16,.025,horizontal?.12:len),this.mat(0xd9b955,.8,0));stripe.position.set((p.x+q.x)/2,.33,(p.z+q.z)/2);this.scene.add(stripe)}
    const lots=[[-70,-18,18,16,0x32433f],[-45,1,17,25,0x394844],[-18,1,17,18,0x263b3b],[14,0,18,31,0x3e4541],[46,0,20,20,0x293d3b],[79,0,16,34,0x3b4142],[-44,43,17,18,0x384b48],[-14,44,18,25,0x283a3b],[17,44,18,16,0x46504b],[48,43,19,28,0x334543],[80,44,15,20,0x263a38]] as const;
    lots.forEach(([x,z,w,h,c],i)=>{const b=this.box(w,h,14,c);b.position.set(x,h/2,z);this.scene.add(b);const glass=this.mat(0x91bdb1,.3,.35);for(let yy=4;yy<h-2;yy+=5)for(const xx of [-w*.27,w*.27]){const win=new THREE.Mesh(new THREE.BoxGeometry(2.3,2.1,.08),glass);win.position.set(x+xx,yy,z-7.05);this.scene.add(win)}const door=new THREE.Mesh(new THREE.BoxGeometry(2.3,3.3,.12),this.mat(0xb89362,.4,.2));door.position.set(x,1.8,z-7.08);this.scene.add(door);if(i%2===0){const roof=this.box(w*.45,1.2,8,0x182724);roof.position.set(x,h+.6,z);this.scene.add(roof)}});
    for(let x=-92;x<96;x+=14){if(Math.abs(x)%28<2)continue;for(const z of [-31,31]){const trunk=this.box(.7,3,.7,0x654d32);trunk.position.set(x,1.5,z);this.scene.add(trunk);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(2.5,1),this.mat(0x315c45));crown.position.set(x,5,z);crown.castShadow=true;this.scene.add(crown)}}
    this.scene.add(this.markerGroup);
  }
  update(state:BookingState){
    const start=places.find(p=>p.id===state.pickup),end=places.find(p=>p.id===state.destination);if(!start||!end)return;const path=route(start.node,end.node);
    if(this.routeLine)this.scene.remove(this.routeLine);const points=path.map(p=>new THREE.Vector3(p.x,.55,p.z));this.carPath=points;this.moveCar=state.step===1&&!this.reduced;this.routeLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x72f1c2,linewidth:3}));this.scene.add(this.routeLine);
    this.markerGroup.clear();[points[0],points.at(-1)!].forEach((p,i)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.65,.65,4,20),this.mat(i?0xffbe75:0x72f1c2,.35,.25));m.position.copy(p);m.position.y=2.3;this.markerGroup.add(m)});
    if(this.car)this.scene.remove(this.car);const spec=vehicles.find(v=>v.id===state.vehicle)!;this.car=this.makeCar(spec.body,spec.color);const mid=points[Math.floor(points.length/2)]??points[0];this.car.position.copy(mid);this.car.position.y=.42;this.scene.add(this.car);
    if(state.step===2){this.targetPos.set(mid.x+18,11,mid.z+20);this.lookAt.copy(mid);this.lookAt.y=1.5}else if(state.step>=3){this.targetPos.set(mid.x+12,7,mid.z+12);this.lookAt.copy(mid);this.lookAt.y=1.4}else{this.targetPos.set(44,47,73);this.lookAt.set(0,0,6)}
  }
  private makeCar(body:string,color:number){
    const g=new THREE.Group();const dims=body==='van'?[5.7,2.25,2.1]:body==='mpv'?[5.25,1.95,1.92]:body==='suv'?[4.65,1.72,1.88]:body==='premium'?[5.05,1.42,1.82]:[4.55,1.35,1.78];const [length,height,width]=dims;const paint=this.mat(color,.28,.55);const lower=new THREE.Mesh(new THREE.BoxGeometry(width,.65,length),paint);lower.position.y=.65;lower.castShadow=true;g.add(lower);const cabin=new THREE.Mesh(new THREE.BoxGeometry(width*.91,height*.55,length*(body==='mpv'||body==='van'?.69:.58)),paint);cabin.position.set(0,1.18,body==='sedan'?.12:-.08);cabin.castShadow=true;g.add(cabin);const glass=this.mat(0x15292d,.12,.65);const windshield=new THREE.Mesh(new THREE.BoxGeometry(width*.82,height*.28,.08),glass);windshield.position.set(0,1.43,-length*.31);windshield.rotation.x=-.18;g.add(windshield);
    for(const z of [-length*.31,length*.31])for(const x of [-width*.51,width*.51]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.24,20),this.mat(0x080909,.8,0));wheel.rotation.z=Math.PI/2;wheel.position.set(x,.43,z);wheel.castShadow=true;g.add(wheel)}
    g.rotation.y=Math.PI/2;return g;
  }
  private resize(){const r=this.canvas.getBoundingClientRect();this.renderer.setSize(r.width,r.height,false);this.camera.aspect=r.width/r.height;this.camera.fov=r.width<700?58:r.width<1100?49:43;this.camera.updateProjectionMatrix()}
  private animate=()=>{this.raf=requestAnimationFrame(this.animate);if(this.car&&this.moveCar&&this.carPath.length>1){const total=this.carPath.length-1;const progress=(performance.now()/4500)%total;const index=Math.floor(progress);const blend=progress-index;this.car.position.lerpVectors(this.carPath[index],this.carPath[index+1],blend);this.car.position.y=.42;const direction=this.carPath[index+1].clone().sub(this.carPath[index]);this.car.rotation.y=Math.atan2(direction.x,direction.z)}const a=this.reduced?1:1-Math.pow(.001,this.clock.getDelta());this.camera.position.lerp(this.targetPos,a);this.camera.lookAt(this.lookAt);this.renderer.render(this.scene,this.camera)};
  destroy(){cancelAnimationFrame(this.raf);this.renderer.dispose()}
}
