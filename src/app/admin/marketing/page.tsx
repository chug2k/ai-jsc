import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { redirect } from 'next/navigation';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const dynamic = 'force-dynamic';

interface Artifact {
  slug: string;
  routine: string;
  date: string;
  audience: string;
  angle: string;
  imageStrategy: string;
  imageUrl: string;
  bufferPostId: string;
  bufferError: string;
  repoOnly: boolean;
  raw: string;
  body: string;
}

function parseArtifact(filename: string, raw: string): Artifact {
  const slug = filename.replace(/\.md$/, '');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fmText = fmMatch?.[1] ?? '';
  const body = (fmMatch?.[2] ?? raw).trim();

  const pick = (key: string) =>
    fmText.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1].trim() ?? '';

  // Nested: buffer.post_id or buffer.error under published:
  const bufferPostId = fmText.match(/^\s*post_id:\s*(.*)$/m)?.[1].trim() ?? '';
  const bufferError = fmText.match(/^\s*error:\s*(.*)$/m)?.[1].trim() ?? '';
  const repoOnly = /^\s*repo_only:\s*true/m.test(fmText);

  return {
    slug,
    routine: pick('routine'),
    date: pick('date'),
    audience: pick('audience'),
    angle: pick('angle'),
    imageStrategy: pick('image'),
    imageUrl: pick('image_url'),
    bufferPostId,
    bufferError,
    repoOnly,
    raw: fmText,
    body,
  };
}

function loadArtifacts(): Artifact[] {
  const dir = join(process.cwd(), 'content/marketing');
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((f) =>
    /^\d{4}-\d{2}-\d{2}-[a-z_]+\.md$/.test(f),
  );
  return files
    .map((f) => parseArtifact(f, readFileSync(join(dir, f), 'utf8')))
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

function loadFile(relPath: string): string {
  const full = join(process.cwd(), relPath);
  if (!existsSync(full)) return '';
  return readFileSync(full, 'utf8');
}

function parseMetricsTable(raw: string) {
  // Find the "By campaign" table and return its rows.
  const tableMatch = raw.match(/\| Rank \|[\s\S]*?(?=\n\n|\n##|$)/);
  if (!tableMatch) return [];
  const lines = tableMatch[0].split('\n').filter((l) => l.trim().startsWith('|'));
  const rows = lines.slice(2).map((line) => {
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    return cells;
  });
  return rows.filter((r) => r.length >= 7);
}

function parseLearningEntries(raw: string): { heading: string; body: string }[] {
  const entries: { heading: string; body: string }[] = [];
  const regex = /^##\s+(.+?)$([\s\S]*?)(?=^##\s|\Z)/gm;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    entries.push({ heading: match[1].trim(), body: match[2].trim() });
  }
  return entries.reverse();
}

export default async function MarketingAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) redirect('/');

  const artifacts = loadArtifacts();
  const learningsRaw = loadFile('content/marketing/LEARNINGS.md');
  const metricsRaw = loadFile('content/marketing/METRICS.md');
  const planRaw = loadFile('MARKETING_PLAN.md');

  const metricsRows = parseMetricsTable(metricsRaw);
  const learnings = parseLearningEntries(learningsRaw).slice(0, 10);

  const routineCounts: Record<string, number> = {};
  artifacts.forEach((a) => {
    if (a.routine) routineCounts[a.routine] = (routineCounts[a.routine] || 0) + 1;
  });

  const shipped = artifacts.filter((a) => a.bufferPostId).length;
  const failed = artifacts.filter((a) => a.bufferError).length;
  const creatives = artifacts.filter((a) => a.imageStrategy === 'generated').length;
  const lastRun = artifacts[0];

  const stats = [
    { label: 'Artifacts', value: String(artifacts.length) },
    { label: 'Shipped to Buffer', value: String(shipped) },
    { label: 'Publish failures', value: String(failed) },
    { label: 'Creative images', value: String(creatives) },
    { label: 'Last run', value: lastRun ? `${lastRun.date} · ${lastRun.routine}` : '—' },
  ];

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              Marketing agent
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280' }}>
              Results and thinking from /marketing-run and /marketing-metrics
            </p>
          </div>
          <a href="/admin" style={{ fontSize: 13, color: '#6B7280' }}>
            ← Admin
          </a>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            marginBottom: 32,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 4,
                padding: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <Label>{s.label}</Label>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: 'var(--font-montserrat)',
                  letterSpacing: '-0.02em',
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {Object.keys(routineCounts).length > 0 && (
          <Card title="Routine distribution">
            {Object.entries(routineCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([r, n]) => (
                <Row key={r} left={r} right={String(n)} />
              ))}
          </Card>
        )}

        <Card title="PostHog metrics">
          {metricsRows.length > 0 ? (
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  {['#', 'Date', 'Routine', 'Angle', 'Views', 'Conv', 'Rate', 'Score'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          padding: '8px 4px',
                          fontFamily: 'var(--font-pt-mono)',
                          fontSize: 11,
                          color: '#9CA3AF',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          fontWeight: 500,
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {metricsRows.slice(0, 20).map((cells, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    {cells.slice(0, 8).map((cell, j) => (
                      <td
                        key={j}
                        style={{
                          padding: '8px 4px',
                          fontFamily: j === 3 ? 'inherit' : 'var(--font-pt-mono)',
                          fontSize: 12,
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState>
              No metrics yet. The /marketing-metrics routine writes here after its
              first run with UTM traffic.
            </EmptyState>
          )}
        </Card>

        <Card title={`Recent runs (${artifacts.length})`}>
          {artifacts.length === 0 ? (
            <EmptyState>
              No artifacts yet. The /marketing-run skill writes here on every daily run.
            </EmptyState>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {artifacts.slice(0, 12).map((a) => (
                <ArtifactCard key={a.slug} a={a} />
              ))}
              {artifacts.length > 12 && (
                <Label>+ {artifacts.length - 12} older artifacts</Label>
              )}
            </div>
          )}
        </Card>

        <Card title="Recent thinking (LEARNINGS)">
          {learnings.length === 0 ? (
            <EmptyState>No learnings yet.</EmptyState>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {learnings.map((l, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontFamily: 'var(--font-pt-mono)',
                      fontSize: 11,
                      color: '#9CA3AF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: 4,
                    }}
                  >
                    {l.heading}
                  </div>
                  <pre
                    style={{
                      whiteSpace: 'pre-wrap',
                      margin: 0,
                      fontFamily: 'inherit',
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: '#374151',
                    }}
                  >
                    {l.body}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Current plan">
          {planRaw ? (
            <details>
              <summary
                style={{
                  cursor: 'pointer',
                  fontSize: 13,
                  color: '#3B82F6',
                  marginBottom: 12,
                }}
              >
                Expand MARKETING_PLAN.md
              </summary>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: '#374151',
                  background: '#FAFAF8',
                  padding: 12,
                  border: '1px solid #F3F4F6',
                  borderRadius: 4,
                  maxHeight: 500,
                  overflow: 'auto',
                }}
              >
                {planRaw}
              </pre>
            </details>
          ) : (
            <EmptyState>MARKETING_PLAN.md not found.</EmptyState>
          )}
        </Card>

        <p
          style={{
            fontSize: 11,
            color: '#9CA3AF',
            fontFamily: 'var(--font-pt-mono)',
            marginTop: 24,
          }}
        >
          Read from disk at request time · files under content/marketing/ on `main`
        </p>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontFamily: 'var(--font-pt-mono)',
        marginBottom: 4,
      }}
    >
      {children}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 4,
        padding: 20,
        marginBottom: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <Label>{title}</Label>
      {children}
    </div>
  );
}

function Row({ left, right }: { left: string; right: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 0',
        fontSize: 14,
        borderBottom: '1px solid #F3F4F6',
      }}
    >
      <span>{left}</span>
      <span style={{ fontWeight: 600 }}>{right}</span>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: '#9CA3AF', padding: '12px 0' }}>{children}</div>
  );
}

function ArtifactCard({ a }: { a: Artifact }) {
  const statusPill = a.bufferPostId
    ? { label: 'queued', bg: '#DCFCE7', fg: '#15803D' }
    : a.bufferError
      ? { label: 'publish error', bg: '#FEE2E2', fg: '#B91C1C' }
      : a.repoOnly
        ? { label: 'repo only', bg: '#E5E7EB', fg: '#374151' }
        : { label: 'unknown', bg: '#FEF3C7', fg: '#92400E' };

  return (
    <div
      style={{
        border: '1px solid #F3F4F6',
        borderRadius: 4,
        padding: 16,
        background: '#FAFAF8',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          marginBottom: 8,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-pt-mono)',
            fontSize: 12,
            color: '#6B7280',
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span>{a.date}</span>
          <span
            style={{
              background: '#3B82F6',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: 3,
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {a.routine}
          </span>
          {a.imageStrategy === 'generated' && (
            <span
              style={{
                background: '#FAF5FF',
                color: '#7C3AED',
                padding: '2px 8px',
                borderRadius: 3,
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              creative
            </span>
          )}
        </div>
        <span
          style={{
            background: statusPill.bg,
            color: statusPill.fg,
            padding: '2px 8px',
            borderRadius: 3,
            fontSize: 10,
            fontFamily: 'var(--font-pt-mono)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {statusPill.label}
        </span>
      </div>

      {a.angle && (
        <div style={{ fontSize: 13, color: '#111', marginBottom: 8, fontStyle: 'italic' }}>
          &ldquo;{a.angle}&rdquo;
        </div>
      )}

      <details style={{ marginBottom: 8 }}>
        <summary
          style={{
            cursor: 'pointer',
            fontSize: 12,
            color: '#3B82F6',
          }}
        >
          Show body
        </summary>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            margin: '8px 0 0',
            fontSize: 12,
            lineHeight: 1.5,
            color: '#374151',
            background: '#fff',
            padding: 12,
            border: '1px solid #F3F4F6',
            borderRadius: 4,
          }}
        >
          {a.body}
        </pre>
      </details>

      {a.imageStrategy === 'generated' && (
        <img
          src={`/marketing/${a.slug}.png`}
          alt=""
          style={{
            maxWidth: 320,
            border: '1px solid #E5E7EB',
            borderRadius: 4,
            display: 'block',
            marginTop: 8,
          }}
        />
      )}

      <div
        style={{
          fontSize: 11,
          color: '#9CA3AF',
          fontFamily: 'var(--font-pt-mono)',
          marginTop: 8,
        }}
      >
        {a.bufferPostId && `buffer: ${a.bufferPostId}`}
        {a.bufferError && `error: ${a.bufferError}`}
      </div>
    </div>
  );
}
