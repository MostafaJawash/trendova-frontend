import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export function ProductCard({ product, onFavoriteChange }) {
  const { add } = useCart()
  const toast = useToast()
  const favorite = async () => {
    const previous = product.is_favorite
    onFavoriteChange?.(product.id, !previous)
    try {
      await api(previous ? 'DELETE' : 'POST', `/favorites/${product.id}`)
      toast(previous ? 'تمت إزالة المنتج من المفضلة' : 'تمت إضافة المنتج إلى المفضلة')
    } catch (error) {
      onFavoriteChange?.(product.id, previous)
      toast(error.message, 'error')
    }
  }
  return <article className="card"><Link to={`/product/${product.id}`}><img className="card__image" src={product.image_url || '/favicon.svg'} alt={product.name} onError={(event) => { event.currentTarget.src = '/favicon.svg' }} /><h2 className="card__title">{product.name}</h2></Link><p className="muted">{product.category?.name || product.category_name || '—'}</p><p className="card__price">{Number(product.price).toFixed(2)} ر.س</p><div className="card__actions"><button type="button" className="icon-button" aria-label="تبديل المفضلة" onClick={favorite}>{product.is_favorite ? '♥' : '♡'}</button><button type="button" onClick={() => { add(product); toast('أضيف المنتج إلى السلة') }}>أضف للسلة</button></div></article>
}
