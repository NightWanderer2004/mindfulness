/* GA4 Measurement Protocol helper */

const MEASUREMENT_ID = 'G-7P1W5PMXRH'
const API_SECRET = 'OElobE0SZmUzaaOhR2Tdg'
const CLIENT_ID_KEY = 'ga_client_id'

async function getOrCreateClientId(): Promise<string> {
  const result = await browser.storage.local.get(CLIENT_ID_KEY)
  let clientId = result[CLIENT_ID_KEY] as string | undefined
  if (!clientId) {
    clientId = self.crypto.randomUUID()
    await browser.storage.local.set({ [CLIENT_ID_KEY]: clientId })
  }
  return clientId
}

function isProdBuild(): boolean {
  try {
    const manifest = browser.runtime.getManifest()
    return 'update_url' in manifest
  } catch {
    return false
  }
}

export type AnalyticsParams = Record<string, string | number | boolean | null>

export async function sendAnalyticsEvent(
  name: string,
  params: AnalyticsParams = {},
): Promise<void> {
  const inProd = isProdBuild()

  try {
    const clientId = await getOrCreateClientId()
    const requestBody = {
      client_id: clientId,
      events: [
        {
          name,
          params: {
            engagement_time_msec: '1',
            ...params,
          },
        },
      ],
    }

    if (!inProd) {
      // Avoid polluting GA in dev; log instead
      console.debug('[GA4:dev]', name, requestBody)
      return
    }

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('GA4 request failed', response.status, text)
    }
  } catch (error) {
    console.error('GA4 send error', error)
  }
}

export async function trackException(
  description: string,
  fatal = false,
  extra: AnalyticsParams = {},
): Promise<void> {
  await sendAnalyticsEvent('exception', {
    description,
    fatal: fatal ? 1 : 0,
    ...extra,
  })
}
