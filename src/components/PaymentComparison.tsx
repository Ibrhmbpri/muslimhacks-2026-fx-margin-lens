import { formatCad, formatPercent, formatRate } from '../domain/format'
import type { CalculationResult, PaymentOption, PaymentResult } from '../domain/types'
import { UnknownCost } from './TrustLegend'

interface Props {
  options: [PaymentOption, PaymentOption]
  results: [CalculationResult<PaymentResult>, CalculationResult<PaymentResult>]
  selectedId: PaymentOption['id']
  ranking: PaymentOption['id'] | 'tie' | null
  onOptionChange: (index: number, field: 'name' | 'quotedCadPerUsd' | 'knownFixedFeeCad', value: string | number) => void
  onSelect: (id: PaymentOption['id']) => void
}

export function PaymentComparison({ options, results, selectedId, ranking, onOptionChange, onSelect }: Props) {
  return (
    <section className="comparison-section" aria-labelledby="comparison-title">
      <div className="section-heading outside-heading">
        <div><span className="eyebrow">02 · Compare quotes</span><h2 id="comparison-title">What does each option disclose?</h2></div>
        <p>Provider type does not determine price. Enter the quote you actually received.</p>
      </div>
      <div className="option-grid">
        {options.map((option, index) => {
          const result = results[index]
          const selected = option.id === selectedId
          const isLowest = ranking === option.id
          return (
            <article key={option.id} className={`panel option-card ${selected ? 'selected-card' : ''}`}>
              <div className="option-topline">
                <span className="option-letter">{index === 0 ? 'A' : 'B'}</span>
                {isLowest && <span className="lowest-pill">Lowest disclosed cost</span>}
                {ranking === 'tie' && <span className="lowest-pill">Disclosed-cost tie</span>}
              </div>
              <label className="field compact-field"><span className="field-label">Option name</span><input className="plain-input" value={option.name} onChange={(e) => onOptionChange(index, 'name', e.target.value)} /></label>
              <div className="two-columns">
                <MiniNumber label="Quoted USD/CAD rate" value={option.quotedCadPerUsd} suffix="CAD per USD" step="0.0001" onChange={(v) => onOptionChange(index, 'quotedCadPerUsd', v)} />
                <MiniNumber label="Known transfer fee" value={option.knownFixedFeeCad} prefix="C$" onChange={(v) => onOptionChange(index, 'knownFixedFeeCad', v)} />
              </div>
              {result.ok ? (
                <dl className="metric-list">
                  <Metric label="Supplier conversion" value={formatCad(result.value.supplierConversionCostCad)} />
                  <Metric label="FX spread vs reference" value={formatCad(result.value.fxSpreadImpactCad)} tone={result.value.fxSpreadImpactCad <= 0 ? 'good' : undefined} />
                  <Metric label="Known fixed fee" value={formatCad(option.knownFixedFeeCad)} />
                  <Metric label="Disclosed cost vs reference" value={formatCad(result.value.disclosedCostVsReferenceCad)} strong />
                  <Metric label="Order profit" value={result.value.profitCad < 0 ? `Loss · ${formatCad(result.value.profitCad)}` : formatCad(result.value.profitCad)} strong tone={result.value.profitCad < 0 ? 'danger' : undefined} />
                  <Metric label="Profit margin" value={result.value.margin < 0 ? `Negative · ${formatPercent(result.value.margin)}` : formatPercent(result.value.margin)} strong tone={result.value.margin < 0 ? 'danger' : undefined} />
                </dl>
              ) : <div className="invalid-box">Complete the highlighted inputs to calculate this option.</div>}
              {option.uncertainCosts.map((cost) => <UnknownCost key={cost.label} item={cost} />)}
              <button type="button" className={selected ? 'selected-button' : 'select-button'} onClick={() => onSelect(option.id)} aria-pressed={selected}>
                {selected ? 'Selected for scenario' : 'Analyze this option'}
              </button>
              <p className="rate-caption">1 USD = {formatRate(option.quotedCadPerUsd)} CAD</p>
            </article>
          )
        })}
      </div>
      <p className="uncertainty-banner">“Lowest disclosed cost” is not a guaranteed cheapest provider. Unknown bank charges can change the final amount.</p>
    </section>
  )
}

function MiniNumber({ label, value, prefix, suffix, step = '0.01', onChange }: { label: string; value: number; prefix?: string; suffix?: string; step?: string; onChange: (value: number) => void }) {
  return <label className="field compact-field"><span className="field-label">{label}</span><span className="input-shell">{prefix && <span>{prefix}</span>}<input type="number" min="0" step={step} value={Number.isFinite(value) ? value : ''} onChange={(e) => onChange(e.target.value === '' ? Number.NaN : Number(e.target.value))} />{suffix && <span>{suffix}</span>}</span></label>
}

function Metric({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: 'good' | 'danger' }) {
  return <div className={strong ? 'strong-metric' : ''}><dt>{label}</dt><dd className={tone}>{value}</dd></div>
}
