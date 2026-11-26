import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal">
      <Sidebar />
      <div className="md:ml-64">
        <TopBar />
        <main className="mx-auto max-w-5xl px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
