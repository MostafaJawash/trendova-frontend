import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { Pagination } from '../components/Pagination'
import { ProductCard } from '../components/ProductCard'

export function Favorites() { const [page, setPage] = useState(1); const [data, setData] = useState(null); const [error, setError] = useState(null); const load = () => { setError(null); api('GET', '/favorites', { query: { page, limit: 10 } }).then(setData).catch(setError) }; useEffect(() => { load() }, [page]); if (error) return <ErrorState error={error} onRetry={load} />; if (!data) return <LoadingState />; const remove = (id, state) => { if (!state) setData({ ...data, items: data.items.filter((product) => product.id !== id) }) }; return <><h1>المفضلة</h1>{data.items.length ? <><div className="cards-grid">{data.items.map((product) => <ProductCard key={product.id} product={product} onFavoriteChange={remove} />)}</div><Pagination page={data.page} pages={data.pages} onPageChange={setPage} /></> : <EmptyState message="لا توجد منتجات مفضلة" />}</> }
