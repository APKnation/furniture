import { useState, useEffect } from 'react';
import { getPage } from '../../services/api';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  const [page, setPage] = useState(null);
  useEffect(() => { getPage('contactus').then(r => setPage(r.data)).catch(() => {}); }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-white mb-3">{page?.title || 'Contact Us'}</h1>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full mx-auto"/>
      </div>
      <div className="card p-8">
        <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
          {page?.content || 'Loading...'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-dark-600">
          {[
            { icon: Mail, label: 'Email', value: 'support@cozyfurniture.com' },
            { icon: Phone, label: 'Phone', value: '+1-800-555-0199' },
            { icon: MapPin, label: 'Address', value: '123 Luxury Way, Comfort City' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-primary-900/40 rounded-xl flex items-center justify-center">
                <Icon size={20} className="text-primary-400"/>
              </div>
              <p className="text-sm text-gray-400">{label}</p>
              <p className="text-white font-medium text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
