import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { AdminLayout } from '../components/AdminLayout'
import { Icon } from '../components/Icon'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { Pagination } from '../components/Pagination'

export function AdminProducts() {
  const [search, setSearch] = useState(''); const [page, setPage] = useState(1); const [data, setData] = useState(null); const [error, setError] = useState(null)
  const load = () => { setError(null); api('GET', '/products', { query: { search, page, limit: 10 } }).then(setData).catch(setError) }
  useEffect(() => { load() }, [page])
  const remove = async (id) => { if (!confirm('حذف المنتج؟')) return; try { await api('DELETE', `/products/${id}`); load() } catch (reason) { setError(reason) } }
  if (error && !data) return <ErrorState error={error} onRetry={load} />
  if (!data) return <LoadingState />
  return <AdminLayout title="إدارة المنتجات" description="أضف المنتجات، عدّل تفاصيلها، أو حدّث المخزون من مكان واحد." actions={<Link className="button" to="/admin/products/new"><Icon name="plus" />إضافة منتج</Link>}>
    <div className="admin-toolbar"><label className="admin-search"><Icon name="search" /><span className="visually-hidden">بحث المنتجات</span><input aria-label="بحث المنتجات" placeholder="ابحث بالاسم…" value={search} onChange={(event) => setSearch(event.target.value)} /></label><button type="button" className="button--secondary" onClick={() => { setPage(1); load() }}>بحث</button><span className="admin-toolbar__count">{data.total ?? data.items.length} منتج</span></div>
    {error && <p className="form-error">{error.message}</p>}
    <div className="table-wrap admin-table"><table><thead><tr><th>المنتج</th><th>السعر</th><th>الحالة</th><th><span className="visually-hidden">إجراءات</span></th></tr></thead><tbody>{data.items.map((product) => <tr key={product.id}><td><span className="product-cell"><img className="avatar product-cell__image" src={product.image_url || '/favicon.svg'} alt="" /><span><strong>{product.name}</strong><small>#{product.id}</small></span></span></td><td>{product.price}</td><td><span className={`status-dot${product.is_active === false ? ' status-dot--muted' : ''}`}>{product.is_active === false ? 'غير نشط' : 'نشط'}</span></td><td><div className="inline-actions"><Link className="icon-button" title="تعديل المنتج" aria-label={`تعديل ${product.name}`} to={`/admin/products/${product.id}/edit`}><Icon name="edit" /></Link><button type="button" className="icon-button icon-button--danger" title="حذف المنتج" aria-label={`حذف ${product.name}`} onClick={() => remove(product.id)}><Icon name="trash" /></button></div></td></tr>)}</tbody></table></div><Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
  </AdminLayout>
}
