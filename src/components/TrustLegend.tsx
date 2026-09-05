import type { CostItem, CostStatus } from '../domain/types'

export function StatusBadge({ status }: { status: CostStatus }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
}

export function UnknownCost({ item }: { item: CostItem }) {
  if (item.status !== 'UNKNOWN') return null
  return (
    <div className="unknown-row">
      <div><strong>{item.label}</strong><span>{item.reason}</span></div>
      <StatusBadge status="UNKNOWN" />
    </div>
  )
}

export function TrustLegend() {
  return (
    <section className="panel trust-panel" aria-labelledby="trust-title">
      <div><span className="eyebrow">Cost confidence</span><h2 id="trust-title">What the numbers know</h2></div>
      <div className="trust-grid">
        <div><StatusBadge status="KNOWN" /><p>Supplied, quoted, published, or exactly calculated.</p></div>
        <div><StatusBadge status="ESTIMATED" /><p>Shown only with a defensible cited range or benchmark.</p></div>
        <div><StatusBadge status="UNKNOWN" /><p>No reliable pre-transfer amount. Never treated as zero.</p></div>
      </div>
      <p className="fine-print">Disclosed totals include known costs only. Estimated and unknown costs remain outside the total.</p>
    </section>
  )
}
