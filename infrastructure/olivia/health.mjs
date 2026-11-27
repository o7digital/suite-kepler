export async function engineAvailable() {
  try {
    const response = await fetch('http://olivia-v3:8093/health', {
      signal: AbortSignal.timeout(3000),
    });
    return response.ok && (await response.json()).status === 'ok';
  } catch {
    return false;
  }
}
