export type TaskType = 'parcel' | 'lost' | 'rescue' | 'collection';
export interface Offer { id: string; type: TaskType; name: string; recipient: string; item: string; at: number; target: number; side: -1 | 1; reward: number; branch?: -1 | 1; goal?: number; dialogue: string }
export interface ActiveTask { offer: Offer; count: number; picked: boolean }
export const LENGTH = 33000;
export const BAMBOO_BOOST = { duration: 30, multiplier: 1.5 };
export const FORK = { start: 10500, split: 11300, merge: 14700, end: 15500 };
export const offers: Offer[] = [
 {id:'picnic',type:'parcel',name:'Rabbit',recipient:'Beaver',item:'Picnic basket',at:1100,target:3900,side:-1,reward:250,dialogue:'Oh, perfect timing! Could you take this picnic basket to Beaver? He’s waiting just downstream.'},
 {id:'scarf',type:'lost',name:'Fox',recipient:'Fox',item:'Red scarf',at:4700,target:6700,side:1,reward:250,dialogue:'My favourite scarf blew into the river! If you spot it downstream, fish it out for me. No need to come back!'},
 {id:'duck',type:'rescue',name:'Duck',recipient:'Otter',item:'Duckling',at:7600,target:9800,side:-1,reward:500,dialogue:'This little duckling needs a lift to Otter’s landing. Room for one small passenger?'},
 {id:'berries',type:'collection',name:'Hedgehog',recipient:'Badger',item:'Berries',at:8400,target:16000,side:1,reward:500,goal:5,dialogue:'Badger is making a pie! Gather five berries on your way to his landing. The left fork has plenty.'},
 {id:'letter',type:'parcel',name:'Owl',recipient:'Frog',item:'A little letter',at:10100,target:13200,side:-1,branch:-1,reward:500,dialogue:'A letter for Frog, please! His landing is on the LEFT fork. Take the calm channel when the river divides.'},
 {id:'hat',type:'lost',name:'Badger',recipient:'Badger',item:'Sun hat',at:17100,target:19100,side:1,reward:250,dialogue:'The wind borrowed my hat. I suspect it’s floating down toward the rapids. Space to scoop it up when you’re close!'},
 {id:'frog',type:'rescue',name:'Frog',recipient:'Duck',item:'Little frog',at:20300,target:23900,side:-1,reward:500,dialogue:'My little cousin would love a ride through the rapids. Duck has a cosy landing beyond the white water.'},
 {id:'supper',type:'collection',name:'Otter',recipient:'Rabbit',item:'Berries',at:22500,target:28100,side:1,reward:500,goal:5,dialogue:'Would you gather five berries for our camp supper? Rabbit will meet you where the river gets quiet.'},
 {id:'lantern',type:'parcel',name:'Beaver',recipient:'Owl',item:'Camp lantern',at:26600,target:31200,side:-1,reward:250,dialogue:'Nearly home! Could you bring this lantern to Owl? A little light for our evening by the river.'}
];
export class Run {
 boostRemaining=0;
 get speedMultiplier(){return this.boostRemaining>0?BAMBOO_BOOST.multiplier:1}
 bamboo(){this.boostRemaining=BAMBOO_BOOST.duration}
 tickBoost(dt:number){this.boostRemaining=Math.max(0,this.boostRemaining-dt)}
 distance=0; x=0; vx=0; speed=55; hearts=3; score=0; riverScore=0; taskScore=0; penalties=0; berries=0; collisions=0; completed=0; helped=0; streak=0; longest=0; immunity=0; branch: -1|1|0=0; forkAwarded=false; active:ActiveTask[]=[]; resolved=new Set<string>();
 get multiplier(){return [1,1.25,1.5,2][Math.min(this.streak,3)]}
 accept(offer:Offer){if(this.active.length>=3||this.resolved.has(offer.id))return false;this.active.push({offer,count:0,picked:offer.type==='rescue'});this.resolved.add(offer.id);return true}
 addRiver(points:number){this.riverScore+=points;this.score+=points}
 berry(){this.berries++;this.addRiver(10);for(const t of this.active)if(t.offer.type==='collection')t.count=Math.min(t.offer.goal??5,t.count+1)}
 complete(id:string){const t=this.active.find(t=>t.offer.id===id);if(!t || (t.offer.type==='collection'&&t.count<(t.offer.goal??5)))return 0;const reward=Math.round(t.offer.reward*this.multiplier);this.taskScore+=reward;this.score+=reward;this.completed++;this.helped++;this.streak++;this.longest=Math.max(this.longest,this.streak);this.active=this.active.filter(t=>t!==t);return reward}
 miss(){const missed=this.active.filter(t=>this.distance>t.offer.target+240);if(missed.length){this.active=this.active.filter(t=>!missed.includes(t));this.streak=0}return missed}
 hit(){if(this.immunity>0)return false;this.hearts--;this.collisions++;this.streak=0;this.immunity=2.5;if(this.hearts===0){const penalty=Math.min(this.score,150);this.penalties+=penalty;this.score-=penalty;this.hearts=3;return true}return false}
}
export function sectionAt(d:number){return d<6500?'Gentle River':d<17000?'Woodland River':d<25500?'The Rapids':'Scenic Finish'}
export function validateContent(){return offers.every(o=>o.at>0&&o.target>o.at&&o.target<LENGTH&&o.reward>0)&&new Set(offers.map(o=>o.id)).size===offers.length}
