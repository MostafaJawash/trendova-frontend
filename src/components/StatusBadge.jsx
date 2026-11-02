const labels = { pending: 'قيد الانتظار', confirmed: 'مؤكد', shipped: 'تم الشحن', delivered: 'تم التسليم', cancelled: 'ملغي' }

export function StatusBadge({ status }) {
  return <span className={`badge badge--${status}`}>{labels[status] || status}</span>
}
