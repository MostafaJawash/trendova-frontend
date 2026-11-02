export function Pagination({ page, pages, onPageChange }) {
  return <nav className="pagination" aria-label="التنقل بين الصفحات"><button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>السابق</button><span>{page} / {pages}</span><button type="button" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>التالي</button></nav>
}
