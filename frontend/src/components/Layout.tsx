import { Outlet } from '@tanstack/react-router';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
