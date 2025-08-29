// Utility to parse daily time series data for charting
export function parseDailyData(timeSeries: Record<string, any>, days: number) {
  // Get the most recent N days, sorted oldest to newest
  return Object.entries(timeSeries)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-days)
    .map(([date, values]) => ({
      date,
      value: parseFloat(values["4. close"]),
    }));
}
