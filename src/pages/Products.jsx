import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { Pagination } from '../components/Pagination'
import { ProductCard } from '../components/ProductCard'
import { useDebounce } from '../hooks/useDebounce'

const sortMap = { newest: ['created_at', 'desc'], priceAsc: ['price', 'asc'], priceDesc: ['price', 'desc'], name: ['name', 'asc'] }

export function Products() {
  const [params, setParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const search = params.get('search') || ''
  const debouncedSearch = useDebounce(search, 300)
  const values = useMemo(() => ({ category: params.get('category') || '', minPrice: params.get('minPrice') || '', maxPrice: params.get('maxPrice') || '', sort: params.get('sort') || 'newest', limit: Number(params.get('limit') || 10), page: Number(params.get('page') || 1) }), [params])
  const update = (key, value) => { const next = new URLSearchParams(params); if (value === '') next.delete(key); else next.set(key, value); if (key !== 'page') next.set('page', '1'); setParams(next) }
  const load = () => { const [sort_by, order] = sortMap[values.sort]; setLoading(true); setError(null); api('GET', '/products', { query: { search: debouncedSearch, category: values.category, minPrice: values.minPrice, maxPrice: values.maxPrice, sort_by, order, limit: values.limit, page: values.page } }).then(setData).catch(setError).finally(() => setLoading(false)) }
  useEffect(() => { api('GET', '/categories', { query: { page: 1, limit: 100 } }).then((result) => setCategories(result.items || [])).catch(() => {}) }, [])
  useEffect(() => { load() }, [debouncedSearch, values.category, values.limit, values.maxPrice, values.minPrice, values.page, values.sort])
  const updateFavorite = (id, isFavorite) => setData((current) => ({ ...current, items: current.items.map((product) => product.id === id ? { ...product, is_favorite: isFavorite } : product) }))
  return <><header className="page-header"><h1>المنتجات</h1></header><section className="filters"><input aria-label="البحث" value={search} placeholder="ابحث عن منتج" onChange={(event) => update('search', event.target.value)} /><select aria-label="الفئة" value={values.category} onChange={(event) => update('category', event.target.value)}><option value="">كل الفئات</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><input aria-label="أقل سعر" type="number" value={values.minPrice} placeholder="أقل سعر" onChange={(event) => update('minPrice', event.target.value)} /><input aria-label="أعلى سعر" type="number" value={values.maxPrice} placeholder="أعلى سعر" onChange={(event) => update('maxPrice', event.target.value)} /><select aria-label="الترتيب" value={values.sort} onChange={(event) => update('sort', event.target.value)}><option value="newest">الأحدث</option><option value="priceAsc">السعر: الأقل للأعلى</option><option value="priceDesc">السعر: الأعلى للأقل</option><option value="name">الاسم أ-ي</option></select><select aria-label="حجم الصفحة" value={values.limit} onChange={(event) => update('limit', event.target.value)}>{[10, 20, 50].map((limit) => <option key={limit} value={limit}>{limit} لكل صفحة</option>)}</select></section>{loading ? <LoadingState /> : error ? <ErrorState error={error} onRetry={load} /> : data.items.length === 0 ? <EmptyState message="لا توجد منتجات" /> : <><div className="cards-grid">{data.items.map((product) => <ProductCard key={product.id} product={product} onFavoriteChange={updateFavorite} />)}</div><Pagination page={data.page} pages={data.pages} onPageChange={(page) => update('page', page)} /></>}</>
}
