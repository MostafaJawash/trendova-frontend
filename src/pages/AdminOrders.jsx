import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { Pagination } from '../components/Pagination'
import { StatusBadge } from '../components/StatusBadge'
import { useRealtime } from '../hooks/useRealtime'

const nextStatus = { pending: ['confirmed', 'cancelled'], confirmed: ['shipped', 'cancelled'], shipped: ['delivered'] }
const sortOrdersNewestFirst = (orders) => [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at) || Number(b.id) - Number(a.id))
const ownerName = (order, usersById) => order.user?.name || order.user_name || usersById[order.user_id]?.name || order.user?.email || order.user_email || order.email || usersById[order.user_id]?.email || `مستخدم #${order.user_id}`

export function AdminOrders() {
  const [data, setData] = useState(null); const [status, setStatus] = useState(''); const [userId, setUserId] = useState(''); const [page, setPage] = useState(1); const [message, setMessage] = useState(''); const [usersById, setUsersById] = useState({})
  const load = useCallback(() => api('GET', '/orders', { query: { status, user_id: userId, page, limit: 10 } }).then((response) => setData({ ...response, items: sortOrdersNewestFirst(response.items) })).catch(error => setMessage(error.message)), [status, userId, page])
  useEffect(() => { load() }, [load])
  useEffect(() => { api('GET', '/users', { query: { page: 1, limit: 100 } }).then((response) => setUsersById(Object.fromEntries(response.items.map((user) => [user.id, user])))).catch(() => {}) }, [])
  const onCreated = useCallback(order => { setData(old => { if (!old || old.items.some((item) => item.id === order.id)) return old; return { ...old, total: old.total + 1, items: sortOrdersNewestFirst([order, ...old.items]).slice(0, old.limit || 10) } }); setMessage(`New order #${order.id}`) }, [])
  const onStatusChanged = useCallback(order => setData(old => old ? { ...old, items: sortOrdersNewestFirst(old.items.map((item) => item.id === order.id ? { ...item, ...order, user: order.user || item.user } : item)) } : old), [])
  const live = useRealtime('private-admin-orders', 'order.created', onCreated)
  useRealtime('private-admin-orders', 'order.status_changed', onStatusChanged)
  const change = async (order, value) => { if (!value) return; try { await api('PATCH', `/orders/${order.id}/status`, { json: { status: value } }); load() } catch (error) { setMessage(error.message) } }
  if (!data && !message) return <LoadingState />; if (!data) return <ErrorState error={{ message }} onRetry={load} />
  return <><h1>Orders <small aria-label="live">{live ? 'live' : 'offline'}</small></h1>{message && <p className="form-error">{message}</p>}<div className="filters"><select aria-label="Order status" value={status} onChange={e => setStatus(e.target.value)}><option value="">All</option>{['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(x => <option key={x}>{x}</option>)}</select><input aria-label="User id" value={userId} onChange={e => setUserId(e.target.value)} /><button type="button" onClick={() => { setPage(1); load() }}>Filter</button></div><div className="table-wrap"><table><thead><tr><th>Order</th><th>User id</th><th>العميل</th><th>Status</th><th /></tr></thead><tbody>{data.items.map(order => <tr key={order.id}><td><Link to={`/orders/${order.id}`}>#{order.id}</Link></td><td>{order.user_id}</td><td>{ownerName(order, usersById)}</td><td><StatusBadge status={order.status} /></td><td><select aria-label={`Order status ${order.id}`} value="" onChange={e => change(order, e.target.value)}><option value="">Change</option>{(nextStatus[order.status] || []).map(x => <option value={x} key={x}>{x}</option>)}</select></td></tr>)}</tbody></table></div><Pagination page={data.page} pages={data.pages} onPageChange={setPage} /></>
}
