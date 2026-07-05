import { normalizeImportedProject } from './index';

describe('normalizeImportedProject', () => {
  it('accepts shared JSON that uses alternate field names', () => {
    const imported = normalizeImportedProject({
      projectName: 'Shared Plan',
      projectStartDate: '2026-06-01',
      sprintCount: 6,
      resourceList: [
        { id: 'r1', name: 'Ada', bill_rate: 180, cost_rate: 90, location: 'Remote' }
      ],
      workstreamList: [
        {
          name: 'API',
          tasks: [
            {
              name: 'Design',
              sprintCount: 2,
              start: 1,
              allocations: [{ resourceId: 'r1', pct: 50 }]
            }
          ]
        }
      ]
    });

    expect(imported.name).toBe('Shared Plan');
    expect(imported.startDate).toBe('2026-06-01');
    expect(imported.totalSprints).toBe(6);
    expect(imported.resources).toHaveLength(1);
    expect(imported.resources[0].billRate).toBe(180);
    expect(imported.resources[0].costRate).toBe(90);
    expect(imported.workstreams).toHaveLength(1);
    expect(imported.workstreams[0].tasks[0].sprints).toBe(2);
    expect(imported.workstreams[0].tasks[0].startSprint).toBe(1);
  });
});
