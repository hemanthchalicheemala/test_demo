import { useNavigate } from 'react-router-dom';
import { LogOut, Shield, Bell, Palette } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { PageHeader } from '../components/ui';

export default function Settings() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl">
      <PageHeader title="Settings" subtitle="Manage your account preferences." />

      <div className="space-y-4">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Shield size={18} /></div>
            <div>
              <h3 className="font-semibold text-slate-800">Account</h3>
              <p className="text-sm text-slate-500">{user?.email} · {user?.role}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Bell size={18} /></div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800">Notifications</h3>
              <p className="text-sm text-slate-500">Email me about requests, payments and complaints</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-brand-600 peer-checked:after:translate-x-5" />
            </label>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Palette size={18} /></div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800">Appearance</h3>
              <p className="text-sm text-slate-500">Light theme (default)</p>
            </div>
          </div>
        </div>

        <div className="card border-red-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">Sign out</h3>
              <p className="text-sm text-slate-500">Log out of your RentConnect account</p>
            </div>
            <button className="btn-danger" onClick={() => { logout(); navigate('/login'); }}><LogOut size={16} /> Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
