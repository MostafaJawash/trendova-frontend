import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'

const items = [
  ['/', 'dashboard', 'لوحة التحكم', true],
  ['/products', 'box', 'المنتجات'],
  ['/categories', 'tag', 'الفئات'],
  ['/orders', 'clipboard', 'الطلبات'],
  ['/users', 'users', 'المستخدمون'],
]

export function AdminLayout({ title, description, actions, children }) {
  return <div className="admin-shell">
    <aside className="admin-sidebar" aria-label="تنقل الإدارة">
      <NavLink className="admin-sidebar__brand" to="/admin"><span className="admin-sidebar__mark">T</span><span>Trendova</span></NavLink>
      <p className="admin-sidebar__caption">مساحة الإدارة</p>
      <nav className="admin-nav">
        {items.map(([path, icon, label, end]) => <NavLink key={path} end={end} to={`/admin${path}`} className={({ isActive }) => `admin-nav__link${isActive ? ' admin-nav__link--active' : ''}`}><Icon name={icon} />{label}</NavLink>)}
      </nav>
    </aside>
    <section className="admin-content">
      <header className="admin-page-header">
        <div><p className="eyebrow">الإدارة</p><h1>{title}</h1>{description && <p className="admin-page-header__description">{description}</p>}</div>
        {actions && <div className="page-header__actions">{actions}</div>}
      </header>
      {children}
    </section>
  </div>
}
