import { useState, useCallback, useEffect } from 'react';
import {
  uuid, DEFAULT_TASKS, buildDefaultState,
  saveToLocalStorage, loadFromLocalStorage, normalizeImportedProject
} from '../utils';

export function useProjectState() {
  const [state, setState] = useState(() => {
    const saved = loadFromLocalStorage();
    return saved || buildDefaultState();
  });

  // Auto-save to localStorage on every change
  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  const updateProject = useCallback((field, value) => {
    setState(s => ({ ...s, [field]: value }));
  }, []);

  // ── Resources ──────────────────────────────────────────────
  const addResource = useCallback(() => {
    setState(s => ({
      ...s,
      resources: [...s.resources, { id: uuid(), name: '', role: '', location: '', billRate: 150,  costRate: 0 }]
    }));
  }, []);

  const updateResource = useCallback((id, field, value) => {
    setState(s => ({
      ...s,
      resources: s.resources.map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  }, []);

  const removeResource = useCallback((id) => {
    setState(s => ({
      ...s,
      resources: s.resources.filter(r => r.id !== id),
      // Also clean up allocations that reference this resource
      workstreams: s.workstreams.map(ws => ({
        ...ws,
        tasks: ws.tasks.map(t => ({
          ...t,
          allocations: t.allocations.filter(a => a.resourceId !== id)
        }))
      }))
    }));
  }, []);

  // ── Workstreams ─────────────────────────────────────────────
const addWorkstream = useCallback(() => {
  setState(s => ({
    ...s,
    workstreams: [...s.workstreams, {
      id: uuid(),
      name: `Workstream ${s.workstreams.length + 1}`,
      tasks: (() => {
        let offset = 0;
        return DEFAULT_TASKS.map(name => {
          const sprints = name === 'Dev' ? 3 : 1;
          const task = { id: uuid(), name, sprints, startSprint: offset, allocations: [], dependencies: '' };
          offset += sprints;
          return task;
        });
      })()
    }]
  }));
}, []);

  const moveTask = useCallback((wsId, taskId, direction) => {
  setState(s => ({
    ...s,
    workstreams: s.workstreams.map(ws => {
      if (ws.id !== wsId) return ws;
      const tasks = [...ws.tasks];
      const idx = tasks.findIndex(t => t.id === taskId);
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= tasks.length) return ws;
      [tasks[idx], tasks[newIdx]] = [tasks[newIdx], tasks[idx]];
      return { ...ws, tasks };
    })
  }));
}, []);
  const updateWorkstream = useCallback((wsId, field, value) => {
    setState(s => ({
      ...s,
      workstreams: s.workstreams.map(ws => ws.id === wsId ? { ...ws, [field]: value } : ws)
    }));
  }, []);

  const removeWorkstream = useCallback((wsId) => {
    setState(s => ({ ...s, workstreams: s.workstreams.filter(ws => ws.id !== wsId) }));
  }, []);

  // ── Tasks ───────────────────────────────────────────────────
const addTask = useCallback((wsId) => {
  setState(s => ({
    ...s,
    workstreams: s.workstreams.map(ws => {
      if (ws.id !== wsId) return ws;
      // default start = after last task
      const lastSprint = ws.tasks.reduce((sum, t) => Math.max(sum, (t.startSprint || 0) + t.sprints), 0);
      return {
        ...ws,
        tasks: [...ws.tasks, { id: uuid(), name: 'New task', sprints: 1, startSprint: lastSprint, allocations: [],  dependencies: '' }]
      };
    })
  }));
}, []);

  const updateTask = useCallback((wsId, taskId, field, value) => {
    setState(s => ({
      ...s,
      workstreams: s.workstreams.map(ws => ws.id !== wsId ? ws : {
        ...ws,
        tasks: ws.tasks.map(t => t.id !== taskId ? t : { ...t, [field]: value })
      })
    }));
  }, []);

  const removeTask = useCallback((wsId, taskId) => {
    setState(s => ({
      ...s,
      workstreams: s.workstreams.map(ws => ws.id !== wsId ? ws : {
        ...ws,
        tasks: ws.tasks.filter(t => t.id !== taskId)
      })
    }));
  }, []);

  // ── Allocations ─────────────────────────────────────────────
  const addAllocation = useCallback((wsId, taskId, resourceId) => {
    setState(s => ({
      ...s,
      workstreams: s.workstreams.map(ws => ws.id !== wsId ? ws : {
        ...ws,
        tasks: ws.tasks.map(t => t.id !== taskId ? t : {
          ...t,
          allocations: [...t.allocations, { id: uuid(), resourceId, pct: 100 }]
        })
      })
    }));
  }, []);

  const updateAllocation = useCallback((wsId, taskId, allocId, field, value) => {
    setState(s => ({
      ...s,
      workstreams: s.workstreams.map(ws => ws.id !== wsId ? ws : {
        ...ws,
        tasks: ws.tasks.map(t => t.id !== taskId ? t : {
          ...t,
          allocations: t.allocations.map(a => a.id !== allocId ? a : { ...a, [field]: value })
        })
      })
    }));
  }, []);

  const removeAllocation = useCallback((wsId, taskId, allocId) => {
    setState(s => ({
      ...s,
      workstreams: s.workstreams.map(ws => ws.id !== wsId ? ws : {
        ...ws,
        tasks: ws.tasks.map(t => t.id !== taskId ? t : {
          ...t,
          allocations: t.allocations.filter(a => a.id !== allocId)
        })
      })
    }));
  }, []);

  // ── JSON Import / Export ────────────────────────────────────
  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (state.name || 'project').replace(/\s+/g, '_') + '.json';
    a.click();
  }, [state]);

  const importJSON = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const normalized = normalizeImportedProject(parsed);
        setState(normalized);
      } catch {
        alert('Invalid JSON file — could not import.');
      }
    };
    reader.readAsText(file);
  }, []);

  const resetProject = useCallback(() => {
    if (window.confirm('Reset to a blank project? This cannot be undone.')) {
      setState(buildDefaultState());
    }
  }, []);

  return {
    state,
    updateProject,
    addResource, updateResource, removeResource,
    addWorkstream, updateWorkstream, removeWorkstream,
    addTask, updateTask, removeTask, moveTask,
    addAllocation, updateAllocation, removeAllocation,
    exportJSON, importJSON, resetProject, 
  };
}
