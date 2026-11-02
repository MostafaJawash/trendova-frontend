export function ErrorState({ error, onRetry }) {
  return <div className="state state--error"><p>{error?.message || 'تعذر تحميل البيانات'}</p>{onRetry && <button type="button" onClick={onRetry}>إعادة المحاولة</button>}</div>
}
