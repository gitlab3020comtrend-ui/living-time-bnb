'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';

interface Booking {
  id: string; roomId: string; checkIn: string; checkOut: string;
  guests: number; name: string; email: string; phone: string; note: string;
  totalPrice?: number; priceBreakdown?: {
    roomName?: string; nightCount?: number; basePrice?: number; baseCost?: number;
    weekendNights?: number; weekendSurcharge?: number; weekendTotal?: number;
    cleaningFee?: number; total?: number;
  };
  createdAt: string; status: string;
}

interface Contact {
  id: string; name: string; email: string; message: string; createdAt: string; read: boolean;
}

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled';

const TOKEN_KEY = 'bnb_admin_token';

function getToken() { return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) || '' : ''; }
function saveToken(t: string) { localStorage.setItem(TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

async function authFetch(url: string, opts: RequestInit = {}) {
  const token = getToken();
  return fetch(url, {
    ...opts,
    headers: { ...opts.headers as Record<string, string>, 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  });
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = checking
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Change password
  const [showChangePw, setShowChangePw] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');

  const [tab, setTab] = useState<'bookings' | 'contacts'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Verify existing token on mount
  useEffect(() => {
    const token = getToken();
    if (!token) { setAuthed(false); return; }
    fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ action: 'verify' }),
    })
      .then(r => r.json())
      .then(d => { setAuthed(d.valid === true); if (!d.valid) clearToken(); })
      .catch(() => { setAuthed(false); clearToken(); });
  }, []);

  const loadData = useCallback(() => {
    authFetch('/api/admin/bookings').then(r => { if (r.ok) return r.json(); throw new Error(); }).then(setBookings).catch(() => {});
    authFetch('/api/admin/contacts').then(r => { if (r.ok) return r.json(); throw new Error(); }).then(setContacts).catch(() => {});
  }, []);

  useEffect(() => { if (authed) loadData(); }, [authed, loadData]);

  async function handleLogin() {
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        saveToken(data.token);
        setAuthed(true);
        setPassword('');
      } else {
        setLoginError(data.error || '登入失敗');
      }
    } catch {
      setLoginError('網路錯誤');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await authFetch('/api/admin/auth', { method: 'POST', body: JSON.stringify({ action: 'logout' }) }).catch(() => {});
    clearToken();
    setAuthed(false);
    setBookings([]);
    setContacts([]);
  }

  async function handleChangePw() {
    setPwError('');
    setPwMsg('');
    if (newPw.length < 4) { setPwError('新密碼至少 4 個字元'); return; }
    if (newPw !== confirmPw) { setPwError('兩次輸入的新密碼不一致'); return; }
    try {
      const res = await authFetch('/api/admin/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'change-password', oldPassword: oldPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPwMsg('密碼已更新，請重新登入');
        setOldPw(''); setNewPw(''); setConfirmPw('');
        setTimeout(() => { clearToken(); setAuthed(false); setShowChangePw(false); setPwMsg(''); }, 1500);
      } else {
        setPwError(data.error || '修改失敗');
      }
    } catch {
      setPwError('網路錯誤');
    }
  }

  async function updateStatus(id: string, status: string) {
    await authFetch('/api/admin/bookings', {
      method: 'PATCH',
      body: JSON.stringify({ id, status }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }

  const filteredBookings = useMemo(() => {
    if (filter === 'all') return bookings;
    return bookings.filter(b => b.status === filter);
  }, [bookings, filter]);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    pending: '待確認',
    confirmed: '已確認',
    cancelled: '已取消',
  };

  const filterCounts = useMemo(() => ({
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }), [bookings]);

  const fmt = (n: number) => n.toLocaleString();

  // ── Loading ──
  if (authed === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-lg tracking-wider text-primary/50">載入中...</p>
      </div>
    );
  }

  // ── Login Screen ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-[0.2em] text-dark mb-2">管理後台</h1>
            <p className="text-base text-primary/50 tracking-wider">請輸入密碼登入</p>
          </div>
          <div className="bg-white border border-sand rounded-sm p-6 space-y-4">
            <div>
              <label className="text-base tracking-wider block mb-2">密碼</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="input-field"
                autoFocus
              />
            </div>
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-base text-red-700">{loginError}</div>
            )}
            <button
              onClick={handleLogin}
              disabled={loginLoading || !password}
              className="w-full py-3 text-base tracking-[0.2em] border border-accent bg-accent text-white hover:bg-primary hover:border-primary transition-all disabled:opacity-50"
            >
              {loginLoading ? '...' : '登入'}
            </button>
          </div>
          <div className="text-center mt-4">
            <a href="/" className="text-sm text-primary/40 hover:text-accent tracking-wider">返回首頁</a>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ──
  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-dark text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg tracking-[0.2em] font-bold">管理後台</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => { setShowChangePw(!showChangePw); setPwError(''); setPwMsg(''); }}
            className="text-xs text-white/60 hover:text-accent tracking-wider">
            修改密碼
          </button>
          <button onClick={handleLogout} className="text-xs text-white/60 hover:text-red-400 tracking-wider">
            登出
          </button>
          <a href="/" className="text-xs text-accent hover:underline">返回首頁</a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Change Password Panel */}
        {showChangePw && (
          <div className="bg-white border border-sand rounded-sm p-6 mb-6 max-w-md">
            <h3 className="text-base font-bold tracking-wider mb-4">修改密碼</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm tracking-wider block mb-1">目前密碼</label>
                <input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-sm tracking-wider block mb-1">新密碼</label>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-sm tracking-wider block mb-1">確認新密碼</label>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="input-field" />
              </div>
              {pwError && <p className="text-sm text-red-600">{pwError}</p>}
              {pwMsg && <p className="text-sm text-green-600">{pwMsg}</p>}
              <div className="flex gap-3">
                <button onClick={handleChangePw}
                  className="px-4 py-2 text-sm bg-accent text-white rounded-sm hover:bg-primary transition">
                  確認修改
                </button>
                <button onClick={() => { setShowChangePw(false); setPwError(''); setPwMsg(''); }}
                  className="px-4 py-2 text-sm border border-primary/30 text-primary rounded-sm hover:border-primary transition">
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button onClick={() => setTab('bookings')}
            className={`px-6 py-2 text-sm tracking-wider rounded-sm transition ${tab === 'bookings' ? 'bg-primary text-white' : 'bg-white text-dark hover:bg-sand'}`}>
            訂房管理 ({bookings.length})
          </button>
          <button onClick={() => setTab('contacts')}
            className={`px-6 py-2 text-sm tracking-wider rounded-sm transition ${tab === 'contacts' ? 'bg-primary text-white' : 'bg-white text-dark hover:bg-sand'}`}>
            聯繫訊息 ({contacts.length})
          </button>
        </div>

        {tab === 'bookings' && (
          <>
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(['all', 'pending', 'confirmed', 'cancelled'] as StatusFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 text-xs tracking-wider rounded-full border transition ${
                    filter === f
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-primary/60 border-sand hover:border-primary/40'
                  }`}
                >
                  {f === 'all' ? '全部' : statusLabels[f]} ({filterCounts[f]})
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredBookings.length === 0 && <p className="text-sm text-primary opacity-60">尚無訂房紀錄</p>}
              {filteredBookings.map(b => {
                const expanded = expandedId === b.id;
                const pb = b.priceBreakdown;
                return (
                  <div key={b.id} className="bg-white rounded-sm shadow-sm overflow-hidden">
                    {/* Main Row */}
                    <div
                      className="p-4 md:p-6 cursor-pointer hover:bg-sand/20 transition"
                      onClick={() => setExpandedId(expanded ? null : b.id)}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold tracking-wider">{b.name}</p>
                            <span className={`text-xs px-3 py-0.5 rounded-full ${statusColors[b.status] || 'bg-gray-100'}`}>
                              {statusLabels[b.status] || b.status}
                            </span>
                          </div>
                          <p className="text-xs text-primary/60 mt-1">
                            {pb?.roomName || b.roomId} · {b.checkIn} ~ {b.checkOut}
                            {pb?.nightCount ? ` (${pb.nightCount}晚)` : ''} · {b.guests}人
                          </p>
                          <p className="text-xs mt-1 text-primary/50">{b.phone} · {b.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {b.totalPrice && (
                            <span className="text-sm font-bold text-primary">NT$ {fmt(b.totalPrice)}</span>
                          )}
                          <span className="text-xs text-primary/30">{expanded ? '▲' : '▼'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {expanded && (
                      <div className="border-t border-sand px-4 md:px-6 py-4 bg-sand/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Price Breakdown */}
                          {pb && (
                            <div>
                              <p className="text-xs font-bold tracking-wider mb-2">價格明細</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>房價 NT$ {fmt(pb.basePrice || 0)} × {pb.nightCount}</span>
                                  <span>NT$ {fmt(pb.baseCost || 0)}</span>
                                </div>
                                {(pb.weekendNights || 0) > 0 && (
                                  <div className="flex justify-between">
                                    <span>假日加價 NT$ {fmt(pb.weekendSurcharge || 0)} × {pb.weekendNights}</span>
                                    <span>NT$ {fmt(pb.weekendTotal || 0)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>清潔費</span>
                                  <span>NT$ {fmt(pb.cleaningFee || 0)}</span>
                                </div>
                                <div className="flex justify-between font-bold border-t border-sand pt-1 mt-1">
                                  <span>合計</span>
                                  <span>NT$ {fmt(pb.total || b.totalPrice || 0)}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Info */}
                          <div>
                            <p className="text-xs font-bold tracking-wider mb-2">訂單資訊</p>
                            <div className="space-y-1 text-xs text-primary/60">
                              <p>訂單編號：{b.id}</p>
                              <p>建立時間：{new Date(b.createdAt).toLocaleString('zh-TW')}</p>
                              {b.note && <p>備註：{b.note}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-4 pt-3 border-t border-sand">
                          {b.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(b.id, 'confirmed')}
                                className="px-4 py-1.5 text-xs bg-green-600 text-white rounded-sm hover:bg-green-700 transition">
                                確認訂單（已收款）
                              </button>
                              <button onClick={() => updateStatus(b.id, 'cancelled')}
                                className="px-4 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded-sm hover:bg-red-100 transition">
                                取消訂單
                              </button>
                            </>
                          )}
                          {b.status === 'confirmed' && (
                            <button onClick={() => updateStatus(b.id, 'cancelled')}
                              className="px-4 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded-sm hover:bg-red-100 transition">
                              取消訂單
                            </button>
                          )}
                          {b.status === 'cancelled' && (
                            <button onClick={() => updateStatus(b.id, 'pending')}
                              className="px-4 py-1.5 text-xs bg-sand text-primary border border-primary/20 rounded-sm hover:bg-sand/80 transition">
                              恢復為待確認
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'contacts' && (
          <div className="space-y-4">
            {contacts.length === 0 && <p className="text-sm text-primary opacity-60">尚無聯繫訊息</p>}
            {contacts.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-sm shadow-sm">
                <p className="font-bold tracking-wider">{c.name} <span className="text-xs text-primary/50 ml-2">{c.email}</span></p>
                <p className="text-sm mt-2 leading-6 opacity-80">{c.message}</p>
                <p className="text-xs text-primary/30 mt-3">{new Date(c.createdAt).toLocaleString('zh-TW')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
