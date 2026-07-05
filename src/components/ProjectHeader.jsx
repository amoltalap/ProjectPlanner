import React from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { Btn } from './UI';
import { projectEndDate, fmt } from '../utils';

export default function ProjectHeader({ state, updateProject, exportJSON, importJSON, resetProject }) {
  const fileInputRef = React.useRef(null);
  const endDate = state.startDate && state.totalSprints
    ? projectEndDate(new Date(state.startDate), state.totalSprints)
    : null;

  function handleImport(e) {
    const file = e.target.files[0];
    if (file) importJSON(file);
    e.target.value = '';
  }

  function handleLoadClick() {
    fileInputRef.current?.click();
  }

  return (
    <div style={{
      background: '#fff', borderBottom: '1px solid #e2e8f0',
      padding: '1rem 1.5rem', display: 'flex', alignItems: 'center',
      gap: 16, flexWrap: 'wrap', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      {/* App brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: '#2563eb',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="4" width="14" height="2" rx="1" fill="white" opacity="0.6"/>
            <rect x="1" y="7.5" width="9" height="2" rx="1" fill="white"/>
            <rect x="1" y="11" width="11" height="2" rx="1" fill="white" opacity="0.8"/>
          </svg>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', letterSpacing: '-0.3px' }}>
          Project Planner
        </span>
      </div>

      {/* Project name */}
      <input
        value={state.name}
        onChange={e => updateProject('name', e.target.value)}
        style={{ fontWeight: 600, fontSize: 15, border: 'none', background: 'transparent',
          borderBottom: '1.5px solid #e2e8f0', borderRadius: 0, padding: '2px 4px',
          minWidth: 180, color: '#1e293b' }}
        placeholder="Project name"
      />

      {/* Dates */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Start</label>
        <input
          type="date"
          value={state.startDate}
          onChange={e => updateProject('startDate', e.target.value)}
          style={{ fontSize: 12, padding: '4px 8px' }}
        />
        <label style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Sprints</label>
        <input
          type="number" min={1} max={52}
          value={state.totalSprints}
          onChange={e => updateProject('totalSprints', Math.max(1, parseInt(e.target.value) || 1))}
          style={{ width: 60, fontSize: 12, padding: '4px 8px', textAlign: 'center' }}
        />
        {endDate && (
          <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 500 }}>
            → {fmt(endDate)}
          </span>
        )}
        <span style={{ fontSize: 11, color: '#94a3b8' }}>
          ({(state.totalSprints || 0) * 2} weeks)
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', alignItems: 'center' }}>
        <Btn size="sm" variant="accent" onClick={exportJSON}>
          <Download size={13} /> Save JSON
        </Btn>
        <div>
          <Btn size="sm" onClick={handleLoadClick}>
            <Upload size={13} /> Load JSON
          </Btn>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>
        <Btn size="sm" onClick={resetProject} style={{ color: '#94a3b8', borderColor: '#e2e8f0' }}>
          <RotateCcw size={12} />
        </Btn>
      </div>
    </div>
  );
}
