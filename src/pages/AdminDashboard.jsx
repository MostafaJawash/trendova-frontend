import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { AdminLayout } from '../components/AdminLayout'
import { Icon } from '../components/Icon'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { StatusBadge } from '../components/StatusBadge'

const labels = { users: 'المستخدمون', products: 'المنتجات', orders: 'الطلبات', categories: 'الفئات' }

export function AdminDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const load = () => { setError(null); api('GET', '/dashboard/stats').then(setData).catch(setError) }
  useEffect(() => { load() }, [])
  if (error) return <ErrorState error={error} onRetry={load} />
  if (!data) return <LoadingState />
  return <AdminLayout title="لوحة الإدارة" description="نظرة سريعة على أداء المتجر وإدارة المحتوى." actions={<Link className="button" to="/admin/products/new"><Icon name="plus" />إضافة منتج</Link>}>
    <section className="admin-quick-actions" aria-label="إجراءات سريعة"><Link to="/admin/products/new"><Icon name="plus" /><span><strong>إضافة منتج</strong><small>أضف منتجًا جديدًا للمخزون</small></span></Link><Link to="/admin/products"><Icon name="edit" /><span><strong>إدارة المنتجات</strong><small>تعديل الأسعار والمخزون</small></span></Link><Link to="/admin/orders"><Icon name="clipboard" /><span><strong>مراجعة الطلبات</strong><small>تابع أحدث طلبات العملاء</small></span></Link></section>
    <section className="dashboard-grid">{Object.entries(data.totals || {}).map(([key, value]) => <article className="metric-card" key={key}><span className="metric-card__label">{labels[key] || key}</span><p className="metric-card__value">{value}</p></article>)}<article className="metric-card metric-card--accent"><span className="metric-card__label">الإيرادات</span><p className="metric-card__value">{data.revenue} ر.س</p></article></section>
    <section className="admin-dashboard-columns"><article className="surface section"><h2 className="section__title">الطلبات حسب الحالة</h2><div className="bar-chart">{Object.entries(data.orders_by_status || {}).map(([status, count]) => <div className="bar-chart__row" key={status}><StatusBadge status={status} /><div className="bar-chart__track"><div className="bar-chart__value" /></div><span>{count}</span></div>)}</div></article><article className="surface section"><h2 className="section__title">أحدث الطلبات</h2><div className="data-list">{(data.recent_orders || []).slice(0, 5).map((order) => <Link className="data-list__item" key={order.id} to={`/orders/${order.id}`}><span>طلب #{order.id}</span><StatusBadge status={order.status} /></Link>)}</div></article></section>
    <section className="surface section"><h2 className="section__title">أفضل المنتجات</h2><div className="table-wrap table-wrap--compact"><table><tbody>{(data.top_products || []).map((item, index) => <tr key={index}><td>{item.name || item.product_name}</td><td>{item.quantity || item.total_sold}</td></tr>)}</tbody></table></div></section>
  </AdminLayout>
}
