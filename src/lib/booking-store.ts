import type { ServiceType, VehicleId } from './catalog';
export interface BookingState { service:ServiceType; pickup:string; destination:string; date:string; time:string; passengers:number; luggage:number; vehicle:VehicleId; driver:string; step:1|2|3|4; status:'editing'|'review'|'prototype-confirmed' }
const tomorrow=new Date(Date.now()+86400000).toISOString().slice(0,10);
export const initialState:BookingState={service:'airport-to-location',pickup:'airport',destination:'taipei101',date:tomorrow,time:'10:30',passengers:2,luggage:2,vehicle:'sedan',driver:'No preference',step:1,status:'editing'};
export type Listener=(state:BookingState)=>void;
export function createBookingStore(seed=initialState){let state={...seed};const listeners=new Set<Listener>();return {get:()=>state,subscribe(fn:Listener){listeners.add(fn);fn(state);return()=>listeners.delete(fn)},set(patch:Partial<BookingState>){state={...state,...patch};listeners.forEach(fn=>fn(state));}}}
