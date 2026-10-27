// Verification script for local CrimIntel dev server
const BASE_URL = 'http://127.0.0.1:3000';

const routes = [
  '/',
  '/features',
  '/security',
  '/about',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/dashboard',
  '/cases',
  '/cases/case-001',
  '/entities',
  '/entities/ent-001',
  '/network',
  '/timeline',
  '/evidence',
  '/alerts',
  '/reports',
  '/import',
  '/search',
  '/audit',
  '/settings',
  '/admin'
];

async function verify() {
  console.log('======================================================');
  console.log('CRIMINTEL - DEV SERVER ROUTE & CONTENT VERIFICATION');
  console.log('Target Server:', BASE_URL);
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    try {
      const res = await fetch(`${BASE_URL}${route}`, {
        signal: AbortSignal.timeout(30000)
      });
      const text = await res.text();
      if (res.status === 200 && text.length > 500) {
        console.log(`[PASS] ${route.padEnd(25)} Status: 200 OK (${text.length} bytes)`);
        passed++;
      } else {
        console.log(`[FAIL] ${route.padEnd(25)} Status: ${res.status} (${text.length} bytes)`);
        failed++;
      }
    } catch (err) {
      console.log(`[ERROR] ${route.padEnd(25)} ${err.message}`);
      failed++;
    }
  }

  // Verify dashboard metrics content
  try {
    const dashRes = await fetch(`${BASE_URL}/dashboard`);
    const dashHtml = await dashRes.text();
    console.log('\n--- DASHBOARD CONTENT VERIFICATION ---');
    const hasCases = dashHtml.includes('Active Cases');
    const hasEntities = dashHtml.includes('Entities Identified');
    const hasConnections = dashHtml.includes('Connections Found');
    const hasEvidence = dashHtml.includes('Evidence Files');
    const hasReview = dashHtml.includes('Items to Review') || dashHtml.includes('Items Requiring Review');
    const hasCrossCase = dashHtml.includes('Cross-Case Links');

    console.log('Active Cases Metric:', hasCases ? '✓ VERIFIED' : '✗ NOT FOUND');
    console.log('Entities Identified Metric:', hasEntities ? '✓ VERIFIED' : '✗ NOT FOUND');
    console.log('Connections Found Metric:', hasConnections ? '✓ VERIFIED' : '✗ NOT FOUND');
    console.log('Evidence Files Metric:', hasEvidence ? '✓ VERIFIED' : '✗ NOT FOUND');
    console.log('Items to Review Metric:', hasReview ? '✓ VERIFIED' : '✗ NOT FOUND');
    console.log('Cross-Case Links Metric:', hasCrossCase ? '✓ VERIFIED' : '✗ NOT FOUND');
  } catch (e) {
    console.log('Dashboard content check error:', e.message);
  }

  console.log('\n======================================================');
  console.log(`SUMMARY: ${passed} ROUTES REACHABLE | ${failed} FAILED`);
  console.log('======================================================');
}

verify();
