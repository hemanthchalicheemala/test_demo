import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Search, FileText, CreditCard, Wrench, Bell, Settings,
  User as UserIcon, LogOut, Home, Users, Megaphone, PlusCircle, Menu, X, ClipboardList, Receipt,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';
import type { Role } from '../types';
import { timeAgo } from '../lib/format';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const navByRole: Record<Role, NavItem[]> = {
  TENANT: [
    { to: '/tenant', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/properties', label: 'Browse Properties', icon: <Search size={18} /> },
    { to: '/tenant/applications', label: 'My Applications', icon: <ClipboardList size={18} /> },
    { to: '/tenant/agreement', label: 'Rental Agreement', icon: <FileText size={18} /> },
    { to: '/tenant/payments', label: 'Rent & Payments', icon: <CreditCard size={18} /> },
    { to: '/tenant/complaints', label: 'Maintenance', icon: <Wrench size={18} /> },
    { to: '/tenant/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ],
  OWNER: [
    { to: '/owner', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/owner/properties', label: 'My Properties', icon: <Building2 size={18} /> },
    { to: '/owner/properties/new', label: 'Add Property', icon: <PlusCircle size={18} /> },
    { to: '/owner/requests', label: 'Rental Requests', icon: <ClipboardList size={18} /> },
    { to: '/owner/tenants', label: 'Tenants', icon: <Users size={18} /> },
    { to: '/owner/payments', label: 'Rent Payments', icon: <Receipt size={18} /> },
    { to: '/owner/complaints', label: 'Maintenance', icon: <Wrench size={18} /> },
    { to: '/owner/announcements', label: 'Announcements', icon: <Megaphone size={18} /> },
    { to: '/owner/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ],
  ADMIN: [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
    { to: '/admin/properties', label: 'Properties', icon: <Building2 size={18} /> },
    { to: '/admin/requests', label: 'Rental Requests', icon: <ClipboardList size={18} /> },
    { to: '/admin/complaints', label: 'Complaints', icon: <Wrench size={18} /> },
  ],
};

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);

  const items = user ? navByRole[user.role] : [];

  const loadNotifs = () => {
    api.get('/notifications').then((res) => {
      setNotifs(res.data.notifications.slice(0, 8));
      setUnread(res.data.unread);
    }).catch(() => {});
  };

  useEffect(() => {
    loadNotifs();
    const id = setInterval(loadNotifs, 20000);
    return () => clearInterval(id);
  }, []);

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    loadNotifs();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-ink-50 lg:flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink-100 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-2.5 px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow"><Home size={18} /></div>
            <span className="font-display text-lg font-extrabold tracking-tight text-ink-900">RentConnect</span>
          </Link>
        </div>
        <div className="px-5 pb-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {user?.role} workspace
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 overflow-y-auto p-3 pb-8" style={{ maxHeight: 'calc(100vh - 6rem)' }}>
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === `/${user?.role.toLowerCase()}` || it.to.split('/').length <= 2}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-gradient text-white shadow-glow'
                    : 'text-ink-600 hover:bg-brand-50 hover:text-brand-700'
                }`
              }
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <span className={isActive ? 'text-white' : 'text-ink-400 group-hover:text-brand-500'}>{it.icon}</span>
                  {it.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-ink-950/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col lg:w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-100 bg-white/70 px-4 backdrop-blur-xl lg:px-8">
          <button className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 lg:hidden" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="hidden items-center gap-2 lg:flex">
            <p className="font-display text-sm font-semibold text-ink-800">Welcome back, {user?.name.split(' ')[0]}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button onClick={() => { setShowNotif((s) => !s); if (!showNotif) loadNotifs(); }} className="relative rounded-xl p-2.5 text-ink-500 transition hover:bg-ink-100">
                <Bell size={19} />
                {unread > 0 && <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">{unread}</span>}
              </button>
              {showNotif && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotif(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-80 animate-fade-in-up overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
                    <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
                      <span className="font-display text-sm font-semibold text-ink-800">Notifications</span>
                      <button onClick={markAllRead} className="text-xs font-medium text-brand-600 hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifs.length === 0 && <p className="px-4 py-8 text-center text-sm text-ink-400">You're all caught up</p>}
                      {notifs.map((n) => (
                        <div key={n.id} className={`border-b border-ink-50 px-4 py-3 transition hover:bg-ink-50 ${!n.read ? 'bg-brand-50/40' : ''}`}>
                          <p className="text-sm font-medium text-ink-800">{n.title}</p>
                          <p className="text-xs text-ink-500">{n.message}</p>
                          <p className="mt-1 text-[11px] text-ink-400">{timeAgo(n.createdAt)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="group relative">
              <button className="flex items-center gap-2.5 rounded-xl p-1.5 pr-2.5 transition hover:bg-ink-100">
                <img src={user?.avatar || `https://i.pravatar.cc/80?u=${user?.email}`} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-white" />
                <span className="hidden text-sm font-semibold text-ink-700 sm:block">{user?.name}</span>
              </button>
              <div className="invisible absolute right-0 mt-1 w-52 overflow-hidden rounded-2xl border border-ink-100 bg-white py-1.5 opacity-0 shadow-soft transition-all group-hover:visible group-hover:opacity-100">
                <div className="border-b border-ink-50 px-4 py-2">
                  <p className="text-sm font-semibold text-ink-800">{user?.name}</p>
                  <p className="truncate text-xs text-ink-400">{user?.email}</p>
                </div>
                <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-600 transition hover:bg-ink-50"><UserIcon size={16} /> Profile</Link>
                <Link to="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-600 transition hover:bg-ink-50"><Settings size={16} /> Settings</Link>
                <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"><LogOut size={16} /> Logout</button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 animate-fade-in p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
