import type { OrderEconomics, ReferenceRate } from '../domain/types'

interface Props {
  order: OrderEconomics
  reference: ReferenceRate
  errors: Record<string, string>
  onOrderChange: (field: keyof OrderEconomics, value: number) => void
  onReferenceChange: (value: number) => void
  onFetchReference: () => void
}

export function OrderInputs({ order, reference, errors, onOrderChange, onReferenceChange, onFetchReference }: Props) {
  return (
    <section className="panel input-panel" aria-labelledby="order-title">
      <div className="section-heading">
        <div><span className="eyebrow">01 · Order economics</span><h2 id="order-title">Start with the deal</h2></div>
        <span className="demo-pill">Editable demo</span>
      </div>
      <p className="section-copy">These are demonstration inputs, not verified market or provider pricing.</p>
      <div className="input-grid">
        <Field label="Supplier invoice" prefix="US$" value={order.supplierInvoiceUsd} error={errors.supplierInvoiceUsd} onChange={(v) => onOrderChange('supplierInvoiceUsd', v)} />
        <Field label="Expected customer revenue" prefix="C$" value={order.customerRevenueCad} error={errors.customerRevenueCad} onChange={(v) => onOrderChange('customerRevenueCad', v)} />
        <Field label="Other known order costs" prefix="C$" value={order.otherKnownCostsCad} error={errors.otherKnownCostsCad} onChange={(v) => onOrderChange('otherKnownCostsCad', v)} />
        <Field label="Target profit margin" suffix="%" value={order.targetMargin * 100} step="0.1" error={errors.targetMargin} onChange={(v) => onOrderChange('targetMargin', v / 100)} />
      </div>
      <div className="reference-box">
        <div>
          <span className="eyebrow">Reference benchmark</span>
          <h3>1 USD = X CAD</h3>
          <p>A reference rate is context—not necessarily the rate your business can transact at.</p>
        </div>
        <div className="reference-actions">
          <Field label="Reference USD/CAD" suffix="CAD per USD" value={reference.cadPerUsd} step="0.0001" error={errors.referenceCadPerUsd} onChange={onReferenceChange} />
          <button className="secondary-button" type="button" onClick={onFetchReference} disabled={reference.status === 'loading'}>
            {reference.status === 'loading' ? 'Checking…' : 'Use Bank of Canada'}
          </button>
        </div>
        <p className={`source-note ${reference.status === 'failed' ? 'error-text' : ''}`} role="status">
          {reference.source === 'bank-of-canada' && reference.observationDate
            ? `Bank of Canada daily reference · ${reference.observationDate}. Not a guaranteed transaction rate.`
            : reference.message ?? 'Manual demo reference · always editable.'}
        </p>
      </div>
    </section>
  )
}

interface FieldProps {
  label: string
  value: number
  prefix?: string
  suffix?: string
  step?: string
  error?: string
  onChange: (value: number) => void
}

function Field({ label, value, prefix, suffix, step = '0.01', error, onChange }: FieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className={`input-shell ${error ? 'input-error' : ''}`}>
        {prefix && <span>{prefix}</span>}
        <input type="number" inputMode="decimal" min="0" step={step} value={Number.isFinite(value) ? value : ''} onChange={(event) => onChange(event.target.value === '' ? Number.NaN : Number(event.target.value))} aria-invalid={Boolean(error)} />
        {suffix && <span>{suffix}</span>}
      </span>
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}
