'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';

export default function ContractPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contracts')
      .then(r => r.json())
      .then(d => {
        setContracts(d.contracts || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container animate-fade-in" style={{paddingTop: 'var(--sp-8)'}}>
      <h1 style={{fontSize: 'var(--fs-2xl)'}}>Reading Contracts</h1>
      <p className="text-secondary mt-2">Manage your commitments for each book here.</p>
      
      {loading ? (
          <div className="skeleton mt-8" style={{height: '200px'}}></div>
      ) : contracts.length === 0 ? (
          <div className="empty-state glass mt-8" style={{marginTop: 'var(--sp-8)'}}>
              <div className="empty-state-icon">📝</div>
              <h2 className="empty-state-title">No active contracts</h2>
              <p className="empty-state-desc">Set a reading contract on an active book to start building unbreakable habits.</p>
          </div>
      ) : (
          <div className="contracts-grid mt-8" style={{marginTop: 'var(--sp-8)', display: 'grid', gap: 'var(--sp-4)'}}>
              {contracts.map(c => (
                  <div key={c.id} className="glass p-6" style={{padding: 'var(--sp-6)'}}>
                      <h3>{c.book?.title}</h3>
                      <p className="text-secondary">Status: {c.status}</p>
                      <p className="text-muted text-sm" style={{marginTop: 'var(--sp-2)'}}>
                          Mode: {c.enforcement_mode} | Target: {c.daily_target_pages ? `${c.daily_target_pages} pages/day` : ''} {c.daily_target_minutes ? `${c.daily_target_minutes} min/day` : ''}
                      </p>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
}
