'use client';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="dashboard-layout">
            <aside className="sidebar glass">
                <div className="logo">📚 Readify</div>
                <nav className="nav-links">
                    <Link href="/" className="nav-link">Overview</Link>
                    <Link href="/books" className="nav-link">Library</Link>
                    <Link href="/streaks" className="nav-link">Streaks</Link>
                    <Link href="/contract" className="nav-link">Contracts</Link>
                </nav>
            </aside>
            <main className="main-content">
                {children}
            </main>
            
            <style jsx>{`
               .dashboard-layout {
                  display: flex;
                  height: 100vh;
                  background: var(--bg-primary);
               }
               .sidebar {
                  width: 260px;
                  border-right: 1px solid var(--border-subtle);
                  padding: var(--sp-6);
                  display: flex;
                  flex-direction: column;
                  gap: var(--sp-8);
                  background: var(--surface-glass);
               }
               .logo {
                   font-family: var(--font-display);
                   font-size: var(--fs-xl);
                   font-weight: var(--fw-bold);
                   color: var(--accent-primary);
               }
               .nav-links {
                   display: flex;
                   flex-direction: column;
                   gap: var(--sp-2);
               }
               .nav-link {
                   padding: var(--sp-3) var(--sp-4);
                   border-radius: var(--radius-md);
                   color: var(--text-secondary);
                   text-decoration: none;
                   transition: all var(--duration-fast);
               }
               .nav-link:hover {
                   background: rgba(255, 255, 255, 0.05);
                   color: var(--text-primary);
               }
               .main-content {
                   flex: 1;
                   overflow-y: auto;
                   position: relative;
               }
            `}</style>
        </div>
    );
}
