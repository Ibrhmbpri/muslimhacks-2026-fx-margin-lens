export function ShariaNote() {
  return (
    <aside className="sharia-note" aria-labelledby="sharia-title">
      <div className="sharia-mark" aria-hidden="true">◇</div>
      <div>
        <span className="eyebrow">Educational note</span>
        <h2 id="sharia-title">A Sharia-aware lens</h2>
        <p>Businesses seeking a Sharia-conscious approach should examine the actual transaction structure—not rely on a generic compliance badge.</p>
        <h3>Sharia-aware approaches to explore</h3>
        <div className="sharia-approaches">
          <p><strong>A. Spot currency exchange</strong><span>Explore actual spot exchange structured around applicable possession and settlement requirements—not speculation on future currency movements.</span></p>
          <p><strong>B. Natural / operational hedging</strong><span>Explore matching USD revenue with USD expenses, adjusting purchase timing, or otherwise reducing unmatched exposure where practical.</span></p>
          <p><strong>C. Supplier and payment-term planning</strong><span>Explore invoice currency, settlement timing, and supplier terms before considering more complex financial arrangements.</span></p>
        </div>
        <p>Treatment depends on the actual transaction structure and scholarly interpretation. Legitimate scholarly differences exist; seek qualified scholarly guidance for specific arrangements.</p>
        <p className="fine-print">Educational only. FX Margin Lens does not certify Sharia compliance and does not issue a fatwa.</p>
        <div className="source-links"><a href="https://aaoifi.com/ss-1-trading-in-currencies/?lang=en" target="_blank" rel="noreferrer">AAOIFI SS (1) — Trading in Currencies ↗</a><a href="https://www.ifsb.org/" target="_blank" rel="noreferrer">IFSB — Institutional standards ↗</a></div>
      </div>
    </aside>
  )
}
