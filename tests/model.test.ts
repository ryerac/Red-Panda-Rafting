import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { Run, offers, validateContent } from '../src/model.ts';
test('bamboo boosts speed for 30 active seconds, refreshes without stacking, and resets on a new run',()=>{
 const r=new Run();assert.equal(r.speedMultiplier,1);r.bamboo();assert.equal(r.boostRemaining,30);assert.equal(r.speedMultiplier,1.5);
 r.tickBoost(12);assert.equal(r.boostRemaining,18);r.bamboo();assert.equal(r.boostRemaining,30);assert.equal(r.speedMultiplier,1.5);
 r.tickBoost(29.9);assert.equal(r.speedMultiplier,1.5);r.tickBoost(.2);assert.equal(r.boostRemaining,0);assert.equal(r.speedMultiplier,1);
 r.bamboo();assert.equal(new Run().boostRemaining,0);
});
test('authored tasks have unique IDs and downstream destinations',()=>assert.equal(validateContent(),true));
test('three tasks maximum; completed tasks cannot be accepted twice',()=>{const r=new Run();offers.slice(0,3).forEach(o=>assert.equal(r.accept(o),true));assert.equal(r.accept(offers[3]),false);r.complete(offers[0].id);assert.equal(r.accept(offers[0]),false);assert.equal(r.accept(offers[3]),true)});
test('collection only completes after enough new berries',()=>{const r=new Run();r.berry();r.accept(offers[3]);assert.equal(r.complete(offers[3].id),0);for(let i=0;i<5;i++)r.berry();assert.equal(r.complete(offers[3].id),500);assert.equal(r.score,560)});
test('task streak increases rewards and missed destinations reset it',()=>{const r=new Run();r.accept(offers[0]);assert.equal(r.complete(offers[0].id),250);r.accept(offers[1]);assert.equal(r.complete(offers[1].id),313);r.accept(offers[2]);r.distance=offers[2].target+241;assert.equal(r.miss().length,1);assert.equal(r.multiplier,1)});
test('collision immunity and recovery preserve tasks without negative score',()=>{const r=new Run();r.accept(offers[0]);r.addRiver(100);assert.equal(r.hit(),false);r.hit();assert.equal(r.hearts,2);r.immunity=0;r.hit();r.immunity=0;assert.equal(r.hit(),true);assert.equal(r.hearts,3);assert.equal(r.score,0);assert.equal(r.penalties,100);assert.equal(r.active.length,1)});
