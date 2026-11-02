import { useSearchParams } from 'react-router-dom'

export function useSearchParamsState(key, initialValue = '') {
  const [params, setParams] = useSearchParams()
  const value = params.get(key) ?? initialValue
  const setValue = (next) => {
    const copy = new URLSearchParams(params)
    if (next === '' || next === null || next === undefined) copy.delete(key)
    else copy.set(key, next)
    setParams(copy)
  }
  return [value, setValue]
}
