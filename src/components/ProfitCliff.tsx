import { formatCad, formatPercent, formatRate } from '../domain/format'
import type { CalculationResult, PaymentOption, ScenarioResult } from '../domain/types'

interface Props {
  selectedOption: PaymentOption
  scenarioRate: number
  result: CalculationResult<ScenarioResult>
  onScenarioRateChange: (value: number) => void
}

export function ProfitCliff({ selectedOption, scenarioRate, result, onScenarioRateChange }: Props) {
  const cliff = result.ok ? result.value.profitCliffCadPerUsd : Math.max(selectedOption.quotedCadPerUsd, 1.5)
  const min = Math.max(0.5, Math.min(selectedOption.quotedCadPerUsd, cliff) - 0.12)
  const max = Math.max(selectedOption.quotedCadPerUsd, cliff) + 0.12
  const status = result.ok ? result.value.targetStatus : 'invalid'

  return (
    <section className={`cliff-stage cliff-${status}`} aria-labelledby="cliff-title">
      <div className="cliff-copy">
        <span className="eyebrow light">03 · The decision moment</span>
        <h2 id="cliff-title">Your Profit Cliff</h2>
        <p>The highest effective USD/CAD rate that still preserves your target margin.</p>
      </div>
      {result.ok ? (
        <>
          <div className="cliff-number"><span>1 USD =</span><strong>{formatRate(result.value.profitCliffCadPerUsd)}</strong><span>CAD</span></div>
          <div className="scenario-control">
            <div className="scenario-labels"><label htmlFor="scenario-range">Move the FX scenario</label><span>{selectedOption.name}</span></div>
            <input id="scenario-range" type="range" min={min} max={max} step="0.0001" value={scenarioRate} onChange={(e) => onScenarioRateChange(Number(e.target.value))} />
            <label className="scenario-number">Scenario rate <input type="number" min="0.0001" step="0.0001" value={Number.isFinite(scenarioRate) ? scenarioRate : ''} onChange={(e) => onScenarioRateChange(e.target.value === '' ? Number.NaN : Number(e.target.value))} /><span>CAD per USD</span></label>
          </div>
          <div className="scenario-results" aria-live="polite">
            <div><span>Supplier cost</span><strong>{formatCad(result.value.supplierCostCad)}</strong></div>
            <div><span>Order profit</span><strong>{formatCad(result.value.profitCad)}</strong></div>
            <div><span>Profit margin</span><strong>{formatPercent(result.value.margin)}</strong></div>
            <div className="scenario-status"><span>Target status</span><strong>{status === 'above' ? '✓ Above target' : status === 'at' ? '◆ At the cliff' : '↓ Below target'}</strong></div>
          </div>
        </>
      ) : <div className="cliff-error">{result.errors[0]?.message ?? 'Complete valid inputs to calculate the Profit Cliff.'}</div>}
      <p className="scenario-disclaimer">Scenario analysis — not an exchange-rate prediction.</p>
    </section>
  )
}
