# Project Planner
Prequisite Software installation - Visual Studio Code, Git Bash and NPM.

A sprint-based project planning tool built in React. Designed for consulting engagements where you need to quickly model team allocations, timelines, and costs across multiple workstreams — without standing up a database or a heavyweight PM tool.

No backend. No database. Saves automatically to browser localStorage, with JSON export/import for sharing.

---

## Quick start

```bash
npm install
npm start
```

Opens at `http://localhost:3000`. Requires Node.js 16+. Download from [nodejs.org](https://nodejs.org) if you don't have it.

---

## Features

### Resources
- Add team members with name, role/title, and location (US/India dropdown)
- Set bill rate and cost rate per person
- Margin % auto-computed and color-coded (green = positive, red = inverted)

### Workstreams
- Group related tasks into workstreams (e.g. Data Platform, API Layer, UI)
- Default tasks per workstream: Design, LLD, Dev, Test, Prod — fully customizable
- Collapse/expand individual workstreams
- Move tasks up/down within a workstream
- Add dependencies as comma-separated pills (type and press Enter)

### Sprint planning
- Each sprint = 2 weeks; calendar dates auto-computed from project start date
- Set start sprint and duration independently per task — tasks don't have to be sequential
- Over-budget warning when a task runs past the project end sprint

### Resource allocation
- Assign multiple resources to any task with % allocation
- Senior resources can be split across workstreams (e.g. 50% on two tasks simultaneously)
- Live over-allocation detection — warns by resource and sprint when total exceeds 100%

### Timeline (Gantt)
- Color-coded sprint grid across all workstreams
- Updates live as you change sprint assignments
- Printable

### Cost summary
- Cost by resource: weighted sprints × 10 days × 8 hours × bill rate
- Cost by workstream and task
- Grand total across the project

### Persistence
- Auto-saves to browser localStorage on every change
- Export to JSON (Save JSON button) for sharing or backup
- Import JSON to restore any saved plan
- Print view for workstreams and timeline

---

## File structure

```
src/
  App.jsx                    # Root — tab routing, layout
  index.js                   # React entry point
  index.css                  # Global styles + print CSS
  hooks/
    useProjectState.js       # All state logic (single source of truth)
  utils/
    index.js                 # Date math, cost calc, overallocation check, localStorage
  components/
    UI.jsx                   # Shared primitives: Btn, Card, Badge, MetricCard, EmptyState
    ProjectHeader.jsx        # Top bar — project name, dates, sprint count, save/load/reset
    ResourcesTab.jsx         # Resource table with bill rate, cost rate, margin
    WorkstreamsTab.jsx       # Workstreams, tasks, allocations, dependency pills, print
    TimelineTab.jsx          # Gantt sprint grid, print
    CostTab.jsx              # Cost breakdown by resource and workstream
```

---

## Cost formula

```
Cost = sprints × (allocation% / 100) × 10 work days × 8 hours × bill rate ($/hr)
```

Margin is computed as:
```
Margin % = (bill rate - cost rate) / bill rate × 100
```

---

## Data model (JSON)

```json
{
  "name": "Project name",
  "startDate": "2026-06-01",
  "totalSprints": 8,
  "resources": [
    {
      "id": "abc123",
      "name": "Alice Chen",
      "role": "Tech Lead",
      "location": "Charlotte, NC",
      "billRate": 200,
      "costRate": 120
    }
  ],
  "workstreams": [
    {
      "id": "def456",
      "name": "Data Platform",
      "tasks": [
        {
          "id": "ghi789",
          "name": "Design",
          "sprints": 1,
          "startSprint": 0,
          "dependencies": "Discovery, Kickoff",
          "allocations": [
            { "id": "jkl012", "resourceId": "abc123", "pct": 50 }
          ]
        }
      ]
    }
  ]
}
```

---

## Setup for a new contributor

```bash
git clone <repo-url>
cd project-planner
npm install
npm start
```

No environment variables. No API keys. No backend setup.

---

## Roadmap ideas

- [ ] Parallel task tracks within a workstream
- [ ] Capacity heatmap view per resource
- [ ] Export to Excel / CSV
- [ ] Multi-project comparison
- [ ] Role-based resource templates
