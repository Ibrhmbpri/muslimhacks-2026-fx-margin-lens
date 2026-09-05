export function ShariaNote() {
  return (
    <aside className="sharia-note" aria-labelledby="sharia-title">
      <div className="sharia-mark" aria-hidden="true">◇</div>
      <div>
        <span className="eyebrow">Educational note</span>
        <h2 id="sharia-title">A Sharia-aware lens</h2>
        <p>Businesses seeking a Sharia-conscious approach should examine the actual transaction structure—not rely on a generic compliance badge. Legitimate scholarly differences exist; seek qualified scholarly guidance for your specific arrangement.</p>
        <p className="fine-print">Educational only. FX Margin Lens does not certify Sharia compliance and does not issue a fatwa.</p>
        <div className="source-links"><a href="https://aaoifi.com/standard/shariah-standards/" target="_blank" rel="noreferrer">AAOIFI Sharia Standards ↗</a><a href="https://www.ifsb.org/" target="_blank" rel="noreferrer">IFSB Standards ↗</a></div>
      </div>
    </aside>
  )
}
