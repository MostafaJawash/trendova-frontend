import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { StatusBadge } from '../components/StatusBadge'

const steps = ['pending', 'confirmed', 'shipped', 'delivered']
export function OrderDetail() { const { id } = useParams(); const [order, setOrder] = useState(null); const [error, setError] = useState(null); const load = () => { setError(null); api('GET', `/orders/${id}`).then(setOrder).catch(setError) }; useEffect(() => { load() }, [id]); if (error) return <ErrorState error={{ message: error.status === 403 ? 'ليس لديك صلاحية لعرض هذا الطلب' : error.status === 404 ? 'الطلب غير موجود' : error.message }} onRetry={load} />; if (!order) return <LoadingState />; const active = steps.indexOf(order.status); return <><h1>طلب #{order.id}</h1><StatusBadge status={order.status} />{order.status === 'cancelled' ? <p className="notice notice--danger">هذا الطلب ملغي</p> : <div className="order-timeline">{steps.map((step, index) => <div className={`order-timeline__step ${index <= active ? 'order-timeline__step--done' : ''}`} key={step}><span className="order-timeline__dot" /><span>{step}</span></div>)}</div>}<div className="table-wrap"><table><thead><tr><th>المنتج</th><th>السعر</th><th>الكمية</th><th>الإجمالي</th></tr></thead><tbody>{order.items.map((item) => <tr key={item.id}><td>{item.product_name}</td><td>{item.unit_price}</td><td>{item.quantity}</td><td>{item.subtotal}</td></tr>)}</tbody></table></div><h2>الإجمالي: {order.total_amount} ر.س</h2></> }
