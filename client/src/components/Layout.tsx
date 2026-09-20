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
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-slate-200 transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white"><Home size={18} /></div>
            <span className="text-lg font-extrabold tracking-tight text-slate-800">RentConnect</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === `/${user?.role.toLowerCase()}` || it.to.split('/').length <= 2}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              {it.icon}
              {it.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col lg:w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-8">
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{user?.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => { setShowNotif((s) => !s); if (!showNotif) loadNotifs(); }} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <Bell size={20} />
                {unread > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unread}</span>}
              </button>
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-100 bg-white shadow-soft">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
                    <span className="text-sm font-semibold text-slate-700">Notifications</span>
                    <button onClick={markAllRead} className="text-xs font-medium text-brand-600 hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifs.length === 0 && <p className="px-4 py-6 text-center text-sm text-slate-400">No notifications</p>}
                    {notifs.map((n) => (
                      <div key={n.id} className={`border-b border-slate-50 px-4 py-3 ${!n.read ? 'bg-brand-50/40' : ''}`}>
                        <p className="text-sm font-medium text-slate-700">{n.title}</p>
                        <p className="text-xs text-slate-500">{n.message}</p>
                        <p className="mt-1 text-[11px] text-slate-400">{timeAgo(n.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="group relative">
              <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100">
                <img src={user?.avatar || `https://i.pravatar.cc/80?u=${user?.email}`} alt="" className="h-8 w-8 rounded-full object-cover" />
                <span className="hidden text-sm font-medium text-slate-700 sm:block">{user?.name}</span>
              </button>
              <div className="invisible absolute right-0 mt-1 w-48 rounded-xl border border-slate-100 bg-white py-1 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100">
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"><UserIcon size={16} /> Profile</Link>
                <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"><Settings size={16} /> Settings</Link>
                <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut size={16} /> Logout</button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
