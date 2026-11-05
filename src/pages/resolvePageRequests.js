export async function resolvePageRequests(requests) {
  const entries = Object.entries(requests);
  const results = await Promise.allSettled(entries.map(([, request]) => request));
  const data = {};
  const failures = [];

  results.forEach((result, index) => {
    const [key] = entries[index];
    if (result.status === 'fulfilled') {
      data[key] = result.value;
    } else {
      const message = result.reason instanceof Error
        ? result.reason.message
        : String(result.reason);
      failures.push(`${key}: ${message}`);
    }
  });

  return {
    data,
    error: failures.length ? `Không tải được dữ liệu: ${failures.join('; ')}` : '',
  };
}
