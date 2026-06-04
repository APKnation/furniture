import React from 'react';
export default function Contact() {
  const [page, setPage] = useState(null);
  useEffect(() => { getPage('contactus').then(r => setPage(r.data)).catch(() => {}); }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-white mb-3">{page?.title || 'Contact Us'}</h1>
      </div>
      <div className="card p-8">
        <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
          {page?.content || 'Loading...'}
        </div>
        <ul className="space-y-4 mt-8">
          <li className="flex items-center text-gray-400">
            <Mail className="w-5 h-5 mr-3" />
            <strong>Email:</strong>&nbsp;apknation@gmail.com
          </li>
          <li className="flex items-center text-gray-400">
            <Phone className="w-5 h-5 mr-3" />
            <strong>Phone:</strong>&nbsp;+255-757-306-134
          </li>
          <li className="flex items-center text-gray-400">
            <MapPin className="w-5 h-5 mr-3" />
            <strong>Address:</strong>&nbsp;Dodoma, Udom, Cive
          </li>
        </ul>
      </div>
    </div>
  );
}