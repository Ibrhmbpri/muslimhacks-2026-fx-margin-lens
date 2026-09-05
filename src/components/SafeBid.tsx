import { formatCad } from '../domain/format'
import type { CalculationResult, ScenarioResult } from '../domain/types'

export function SafeBid({ result, targetMargin, hasUnknownCosts }: { result: CalculationResult<ScenarioResult>; targetMargin: number; hasUnknownCosts: boolean }) {
  return (
    <section className="panel safe-bid" aria-labelledby="safe-bid-title">
      <div><span className="eyebrow">04 · Protect the margin</span><h2 id="safe-bid-title">Safe selling price</h2></div>
      {result.ok ? (
        <>
          <div className="safe-price"><span>Minimum customer price</span><strong>{formatCad(result.value.safeBidCad)}</strong></div>
          <p>At this scenario rate, charge at least <strong>{formatCad(result.value.safeBidCad)}</strong> to preserve your {(targetMargin * 100).toFixed(2)}% target margin based on known costs.</p>
          {hasUnknownCosts && <p className="unknown-note">Unknown payment costs are not included and could increase the required price.</p>}
        </>
      ) : <div className="invalid-box">Safe Bid is unavailable. {result.errors[0]?.message}</div>}
    </section>
  )
}
