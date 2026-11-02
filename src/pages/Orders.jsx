import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { Pagination } from '../components/Pagination'
import { StatusBadge } from '../components/StatusBadge'

export function Orders() { const [status, setStatus] = useState(''); const [page, setPage] = useState(1); const [data, setData] = useState(null); const [error, setError] = useState(null); const load = () => { setError(null); api('GET', '/orders', { query: { status, page, limit: 10 } }).then(setData).catch(setError) }; useEffect(() => { load() }, [page, status]); if (error) return <ErrorState error={error} onRetry={load} />; if (!data) return <LoadingState />; return <><header className="page-header"><h1>طلباتي</h1><select aria-label="حالة الطلب" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}><option value="">كل الحالات</option>{['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((item) => <option value={item} key={item}>{item}</option>)}</select></header>{data.items.length ? <><div className="data-list">{data.items.map((order) => <Link className="data-list__item" to={`/orders/${order.id}`} key={order.id}><span>طلب #{order.id}<br /><small className="muted">{new Date(order.created_at).toLocaleDateString('ar')}</small></span><StatusBadge status={order.status} /><strong>{order.total_amount} ر.س</strong></Link>)}</div><Pagination page={data.page} pages={data.pages} onPageChange={setPage} /></> : <EmptyState message="لا توجد طلبات" />}</> }
