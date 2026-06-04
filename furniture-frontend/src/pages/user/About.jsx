import { useState, useEffect } from 'react';
import { getPage } from '../../services/api';

export default function About() {
  const [page, setPage] = useState(null);
  useEffect(() => { getPage('aboutus').then(r => setPage(r.data)).catch(() => {}); }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-white mb-3">{page?.title || 'About Us'}</h1>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full mx-auto"/>
      </div>
      <div className="card p-8">
        <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
          {page?.content || 'Loading...'}
        </p>
      </div>
    </div>
  );
}
