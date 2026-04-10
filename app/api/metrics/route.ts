import { NextResponse } from 'next/server';

// In-memory cache for Level 2 (ephemeral in serverless, but works for demonstration)
let cache: { data: { sessions: number; paid: number; level: number; ts?: string; flag?: string }; ts: number } | null = null;

export async function GET() {
  try {
    // Level 1: Live ESOZ
    const statusController = new AbortController();
    const statusTimeout = setTimeout(() => statusController.abort(), 5000);
    
    const statusRes = await fetch("https://status.ehealth.gov.ua/public-api", { 
      signal: statusController.signal 
    }).catch(() => null);
    
    clearTimeout(statusTimeout);

    if (statusRes && statusRes.ok) {
      const text = await statusRes.text();
      if (text.includes("UP")) {
        const params = new URLSearchParams({ service_type: "psychiatry", period: "2026-04", status: "completed" });
        
        const declController = new AbortController();
        const declTimeout = setTimeout(() => declController.abort(), 10000);
        
        const declRes = await fetch(`https://emd.ehealth.gov.ua/api/v2/mpi/declarations?${params}`, { 
          signal: declController.signal 
        }).catch(() => null);
        
        clearTimeout(declTimeout);
        
        if (declRes && declRes.ok) {
          const data = await declRes.json();
          const sessions = data.filter((d: { service?: string }) => (d.service || "").includes("psych")).length;
          const result = { sessions, paid: sessions * 285, level: 1, ts: new Date().toISOString() };
          cache = { data: result, ts: Date.now() };
          return NextResponse.json(result);
        }
      }
    }
  } catch (e) {
    console.error("Level 1 failed", e);
  }

  // Level 2: Cache
  if (cache && (Date.now() - cache.ts) < 2 * 24 * 60 * 60 * 1000) {
    return NextResponse.json({ ...cache.data, level: 2 });
  }

  // Level 3: NSZU CSV
  try {
    const csvController = new AbortController();
    const csvTimeout = setTimeout(() => csvController.abort(), 5000);
    
    const csvRes = await fetch("https://nszu.gov.ua/e-data/dashboard/pmd-map.csv", { 
      signal: csvController.signal 
    }).catch(() => null);
    
    clearTimeout(csvTimeout);

    if (csvRes && csvRes.ok) {
      const csvText = await csvRes.text();
      const lines = csvText.split('\n');
      const header = lines[0].split(',');
      const packageIdx = header.indexOf('package');
      const sessionsIdx = header.indexOf('fact_sessions');
      
      if (packageIdx !== -1 && sessionsIdx !== -1) {
        const psychRow = lines.find(line => {
          const cols = line.split(',');
          return cols[packageIdx] && cols[packageIdx].includes('psych');
        });
        
        if (psychRow) {
          const factSessions = parseInt(psychRow.split(',')[sessionsIdx], 10);
          if (!isNaN(factSessions)) {
            const daily = Math.floor(factSessions / 30);
            const result = { sessions: daily, paid: daily * 285, level: 3 };
            cache = { data: result, ts: Date.now() };
            return NextResponse.json(result);
          }
        }
      }
    }
  } catch (e) {
    console.error("Level 3 failed", e);
  }

  // Level 4: Projection
  const baseSessions = cache ? Math.floor(cache.data.sessions * 1.012) : 15000;
  return NextResponse.json({
    sessions: baseSessions,
    paid: baseSessions * 285,
    level: 4,
    flag: "PROJECTION"
  });
}
