const ENDPOINT = 'https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=1'

export type ReferenceRateResponse =
  | { ok: true; cadPerUsd: number; observationDate: string }
  | { ok: false; message: string }

export async function fetchBankOfCanadaRate(): Promise<ReferenceRateResponse> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 6_000)

  try {
    const response = await fetch(ENDPOINT, { signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const payload: unknown = await response.json()
    if (!payload || typeof payload !== 'object' || !('observations' in payload)) throw new Error('Invalid response')
    const observations = (payload as { observations?: unknown }).observations
    if (!Array.isArray(observations) || observations.length === 0) throw new Error('No observations')
    const latest = observations.at(-1) as { d?: unknown; FXUSDCAD?: { v?: unknown } }
    const cadPerUsd = Number(latest?.FXUSDCAD?.v)
    if (typeof latest?.d !== 'string' || !Number.isFinite(cadPerUsd) || cadPerUsd <= 0) throw new Error('Invalid observation')
    return { ok: true, cadPerUsd, observationDate: latest.d }
  } catch {
    return { ok: false, message: 'Reference rate unavailable. Your manual rate still works.' }
  } finally {
    window.clearTimeout(timeout)
  }
}
