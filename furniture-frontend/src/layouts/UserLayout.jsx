import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-dark-800 border-t border-dark-600 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">© 2026 APKnation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
