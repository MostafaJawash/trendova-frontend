import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export function ProductDetail() {
  const { id } = useParams(); const { isAdmin } = useAuth(); const { add } = useCart(); const toast = useToast()
  const [product, setProduct] = useState(null); const [error, setError] = useState(null); const [quantity, setQuantity] = useState(1)
  const load = () => { setError(null); api('GET', `/products/${id}`).then(setProduct).catch(setError) }
  useEffect(() => { load() }, [id])
  if (error) return <ErrorState error={error} onRetry={load} />
  if (!product) return <LoadingState />
  const unavailable = product.stock?.status === 'unavailable'; const available = product.stock?.quantity ?? 1000; const max = unavailable ? 1000 : Math.max(1, available)
  const favorite = async () => { const old = product.is_favorite; setProduct({ ...product, is_favorite: !old }); try { await api(old ? 'DELETE' : 'POST', `/favorites/${id}`) } catch (reason) { setProduct({ ...product, is_favorite: old }); toast(reason.message, 'error') } }
  return <section className="product-layout"><img className="product-image" src={product.image_url || '/favicon.svg'} alt={product.name} onError={(event) => { event.currentTarget.src = '/favicon.svg' }} /><div className="surface stack"><div className="row row--between"><h1>{product.name}</h1><button type="button" className="icon-button" onClick={favorite}>{product.is_favorite ? '♥' : '♡'}</button></div><p>{product.description || 'لا يوجد وصف.'}</p><p>الفئة: {product.category?.name || '—'}</p><p className="price">{Number(product.price).toFixed(2)} ر.س</p>{unavailable ? <p className="notice">تعذّر معرفة الكمية حاليا</p> : <p className="notice">{available > 0 ? `متوفر: ${available}` : 'غير متوفر'}</p>}<div className="row"><label>الكمية <input aria-label="كمية المنتج" type="number" min="1" max={max} value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(max, Number(event.target.value) || 1)))} /></label><button type="button" disabled={!unavailable && available < 1} onClick={() => { for (let index = 0; index < quantity; index += 1) add(product); toast('أضيف المنتج إلى السلة') }}>أضف للسلة</button></div>{isAdmin && <div className="notice">أنشئ: {product.created_at || '—'}<br />آخر تحديث: {product.updated_at || '—'}<br />نشط: {String(product.is_active)}<br /><Link className="link" to={`/admin/products/${id}/edit`}>تعديل المنتج</Link></div>}</div></section>
}
