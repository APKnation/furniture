import { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { getAdminUsers } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.mobileNumber?.includes(search)
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Registered Users</h1>
          <p className="text-gray-400 text-sm mt-0.5">{filteredUsers.length} total user(s)</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="input pl-10" placeholder="Search by name, email, or mobile number..."/>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="border-b border-dark-600 bg-dark-700/50">
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Customer</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Contact</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Address</th>
                <th className="text-right px-5 py-3.5 text-gray-400 font-medium">Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => <tr key={i}><td colSpan={4} className="px-5 py-4"><div className="h-5 bg-dark-700 rounded animate-pulse"/></td></tr>)
              ) : filteredUsers.map(u => (
                <tr key={u.id} className="border-b border-dark-600/50 table-row-hover">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-900/40 rounded-xl flex items-center justify-center text-primary-400 flex-shrink-0">
                        <User size={16}/>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{u.name}</p>
                        <p className="text-xs text-gray-500">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                      <Mail size={12} className="text-gray-500"/>
                      <span>{u.email}</span>
                    </div>
                    {u.mobileNumber && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Phone size={12} className="text-gray-500"/>
                        <span>{u.mobileNumber}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs max-w-xs truncate" title={u.address}>
                    {u.address ? (
                      <div className="flex items-start gap-1">
                        <MapPin size={12} className="text-gray-500 mt-0.5 flex-shrink-0"/>
                        <span>{u.address}</span>
                      </div>
                    ) : (
                      <span className="text-gray-600 italic">Not set</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right text-gray-400 text-xs">
                    <div className="inline-flex items-center gap-1.5">
                      <Calendar size={12} className="text-gray-500"/>
                      <span>{new Date(u.regDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && !filteredUsers.length && (
          <div className="text-center py-16 text-gray-500">No users found matching your search.</div>
        )}
      </div>
    </div>
  );
}
