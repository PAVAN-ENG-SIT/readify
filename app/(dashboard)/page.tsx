'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function DashboardOverview() {
    const [streakData, setStreakData] = useState<any>(null);
    const [books, setBooks] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/streaks').then(r=>r.json()).then(d=>setStreakData(d.streak));
        fetch('/api/books').then(r=>r.json()).then(d=>setBooks(d.books?.slice(0, 3) || []));
    }, []);

    return (
        <div className="container p-8 animate-fade-in" style={{paddingTop: 'var(--sp-8)'}}>
            <h1 style={{fontSize: 'var(--fs-3xl)'}}>Welcome Back 👋</h1>
            <p className="text-secondary mt-2">Here is your reading overview for today.</p>

            <div className="grid mt-8" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--sp-6)', marginTop: 'var(--sp-8)'}}>
                
                {/* Streak Card */}
                <div className="glass p-6" style={{padding: 'var(--sp-6)', borderRadius: 'var(--radius-xl)'}}>
                    <h3 className="text-secondary mb-4">Current Streak</h3>
                    <div className="flex-center" style={{display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)'}}>
                       <span style={{fontSize: '3rem'}}>🔥</span>
                       <span style={{fontSize: '3rem', fontWeight: 'bold'}}>{streakData?.current_streak || 0}</span>
                       <span className="text-secondary">Days</span>
                    </div>
                    <Link href="/streaks" style={{textDecoration: 'none'}}>
                        <Button fullWidth size="sm" variant="secondary" style={{marginTop: 'var(--sp-4)'}}>View Details</Button>
                    </Link>
                </div>

                {/* Progress Card */}
                <div className="glass p-6" style={{padding: 'var(--sp-6)', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column'}}>
                    <h3 className="text-secondary mb-4">Recent Books</h3>
                    {books.length > 0 ? (
                        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', flex: 1}}>
                            {books.map(b => (
                                <div key={b.id} style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span style={{fontSize: 'var(--fs-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px'}}>
                                        {b.book?.title}
                                    </span>
                                    <span style={{fontSize: 'var(--fs-sm)', color: 'var(--accent-primary)'}}>
                                        {b.progress_percent?.toFixed(0)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', flex: 1}}>No books in progress.</p>
                    )}
                    <Link href="/books" style={{textDecoration: 'none'}}>
                        <Button fullWidth size="sm" variant="secondary" style={{marginTop: 'var(--sp-4)'}}>Library</Button>
                    </Link>
                </div>
                
            </div>
        </div>
    );
}
