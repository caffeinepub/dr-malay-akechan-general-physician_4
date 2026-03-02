import { Outlet } from '@tanstack/react-router';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
