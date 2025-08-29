// Utility to parse intraday (5min) time series data for charting
export function parseIntradayData(timeSeries: Record<string, any>) {
  return Object.entries(timeSeries)
    .map(([time, values]) => ({
      time,
      value: parseFloat(values["4. close"]),
    }))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
}
