import { googleAnalytics4 } from '@wxt-dev/analytics/providers/google-analytics-4'

declare const defineAppConfig: <T>(config: T) => T

export default defineAppConfig({
  enabled: true,
  debug: true,
  analytics: {
    providers: [
      googleAnalytics4({
        apiSecret: import.meta.env.WXT_GA_API_SECRET || '',
        measurementId: import.meta.env.WXT_GA_MEASUREMENT_ID || '',
      }),
    ],
  },
})
