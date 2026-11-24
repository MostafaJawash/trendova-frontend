import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { StatusBadge } from '../components/StatusBadge'
import { useRealtime } from '../hooks/useRealtime'
const steps=['pending','confirmed','shipped','delivered']
export function OrderDetail(){const {id}=useParams();const [order,setOrder]=useState(null);const [error,setError]=useState(null);const load=useCallback(()=>{setError(null);api('GET',`/orders/${id}`).then(setOrder).catch(setError)},[id]);useEffect(()=>{load()},[load]);const live=useRealtime(`private-order.${id}`,'order.status_changed',useCallback(value=>setOrder(value),[]));if(error)return <ErrorState error={{message:error.message}} onRetry={load}/>;if(!order)return <LoadingState/>;const active=steps.indexOf(order.status);return <><h1>Order #{order.id} <small>{live?'live':'offline'}</small></h1><StatusBadge status={order.status}/>{order.status==='cancelled'?<p className="notice notice--danger">Cancelled</p>:<div className="order-timeline">{steps.map((step,index)=><div className={`order-timeline__step ${index<=active?'order-timeline__step--done':''}`} key={step}><span className="order-timeline__dot"/><span>{step}</span></div>)}</div>}<div className="table-wrap"><table><tbody>{order.items.map(item=><tr key={item.id}><td>{item.product_name}</td><td>{item.unit_price}</td><td>{item.quantity}</td><td>{item.subtotal}</td></tr>)}</tbody></table></div><h2>Total: {order.total_amount}</h2></>}
