import { useMemo, useState } from 'react'
import './App.css'
import { DecisionLens } from './components/DecisionLens'
import { OrderInputs } from './components/OrderInputs'
import { PaymentComparison } from './components/PaymentComparison'
import { ProfitCliff } from './components/ProfitCliff'
import { SafeBid } from './components/SafeBid'
import { ShariaNote } from './components/ShariaNote'
import { TrustLegend } from './components/TrustLegend'
import { buildDecisionLens } from './domain/decisionLens'
import { calculatePaymentResult, calculateScenario, rankDisclosedCosts } from './domain/fxMath'
import type { OrderEconomics, PaymentOption, ReferenceRate } from './domain/types'
import { validateOrder, validateRate } from './domain/validation'
import { fetchBankOfCanadaRate } from './services/bankOfCanada'
import { demoOptions, demoOrder, demoReferenceRate } from './test/fixtures'

function App() {
  const [order, setOrder] = useState<OrderEconomics>({ ...demoOrder })
  const [reference, setReference] = useState<ReferenceRate>({ ...demoReferenceRate })
  const [options, setOptions] = useState<[PaymentOption, PaymentOption]>(() => structuredClone(demoOptions))
  const [selectedId, setSelectedId] = useState<PaymentOption['id']>('option-b')
  const [scenarioRate, setScenarioRate] = useState(demoOptions[1].quotedCadPerUsd)

  const errors = useMemo(() => Object.fromEntries(
    [...validateOrder(order), ...validateRate(reference.cadPerUsd, 'referenceCadPerUsd')]
      .map((error) => [error.field, error.message]),
  ), [order, reference.cadPerUsd])

  const results = useMemo(() => [
    calculatePaymentResult(order, reference.cadPerUsd, options[0]),
    calculatePaymentResult(order, reference.cadPerUsd, options[1]),
  ] as const, [order, options, reference.cadPerUsd])

  const validResults = results[0].ok && results[1].ok ? [results[0].value, results[1].value] as const : null
  const ranking = validResults ? rankDisclosedCosts(validResults[0], validResults[1]) : null
  const selectedOption = options.find((option) => option.id === selectedId) ?? options[0]
  const selectedResult = validResults?.find((result) => result.optionId === selectedId)
  const scenario = useMemo(() => calculateScenario(order, selectedOption, scenarioRate), [order, selectedOption, scenarioRate])
  const statements = validResults && selectedResult && scenario.ok && ranking
    ? buildDecisionLens({ options, results: validResults, selectedOption, selectedResult, scenario: scenario.value, ranking, referenceRate: reference.cadPerUsd, scenarioRate })
    : []

  const updateOrder = (field: keyof OrderEconomics, value: number) => setOrder((current) => ({ ...current, [field]: value }))
  const updateReference = (value: number) => setReference({ cadPerUsd: value, source: 'manual', status: 'manual', message: 'Manual reference · always editable.' })
  const updateOption = (index: number, field: 'name' | 'quotedCadPerUsd' | 'knownFixedFeeCad', value: string | number) => setOptions((current) => {
    const next = structuredClone(current) as [PaymentOption, PaymentOption]
    next[index] = { ...next[index], [field]: value }
    return next
  })
  const selectOption = (id: PaymentOption['id']) => {
    setSelectedId(id)
    setScenarioRate(options.find((option) => option.id === id)?.quotedCadPerUsd ?? scenarioRate)
  }
  const loadReference = async () => {
    setReference((current) => ({ ...current, status: 'loading', message: 'Loading the latest daily reference…' }))
    const response = await fetchBankOfCanadaRate()
    if (response.ok) setReference({ cadPerUsd: response.cadPerUsd, source: 'bank-of-canada', observationDate: response.observationDate, status: 'loaded' })
    else setReference((current) => ({ ...current, source: 'manual', status: 'failed', message: response.message }))
  }

  return (
    <div className="app-shell">
      <header className="hero-header">
        <nav><a className="brand" href="#top" aria-label="FX Margin Lens home"><span>FX</span> Margin Lens</a><span className="hackathon-label">MuslimHacks 2026 · International Trades</span></nav>
        <div className="hero-content" id="top">
          <div><span className="hero-kicker">Know the margin before you move the money.</span><h1>See where FX turns<br />profit into <em>pressure.</em></h1><p>Compare payment quotes, expose the spread, and find the exact USD/CAD rate where your target margin breaks.</p></div>
          <div className="convention-card"><span>One convention. Everywhere.</span><strong>1 USD = X CAD</strong><p>CAD required to buy 1 US dollar. Never inverted.</p></div>
        </div>
        <div className="hero-strip"><span>Decision support only</span><span>Not a payment provider</span><span>Not financial advice</span></div>
      </header>
      <main>
        <OrderInputs order={order} reference={reference} errors={errors} onOrderChange={updateOrder} onReferenceChange={updateReference} onFetchReference={loadReference} />
        <PaymentComparison options={options} results={[results[0], results[1]]} selectedId={selectedId} ranking={ranking} onOptionChange={updateOption} onSelect={selectOption} />
        <ProfitCliff selectedOption={selectedOption} scenarioRate={scenarioRate} result={scenario} onScenarioRateChange={setScenarioRate} />
        <div className="decision-grid"><SafeBid result={scenario} targetMargin={order.targetMargin} hasUnknownCosts={selectedOption.uncertainCosts.some((cost) => cost.status === 'UNKNOWN')} /><DecisionLens statements={statements} /></div>
        <TrustLegend />
        <ShariaNote />
      </main>
      <footer><div className="brand footer-brand"><span>FX</span> Margin Lens</div><p>Reference rates provide context, not a guaranteed transaction price. Verify actual terms with your provider.</p><span>Built for MuslimHacks 2026</span></footer>
    </div>
  )
}

export default App
