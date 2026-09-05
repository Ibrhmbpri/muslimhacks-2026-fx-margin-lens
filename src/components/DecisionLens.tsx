export function DecisionLens({ statements }: { statements: string[] }) {
  return (
    <section className="panel decision-lens" aria-labelledby="lens-title">
      <div><span className="eyebrow">05 · Decision Lens</span><h2 id="lens-title">What this means</h2></div>
      {statements.length ? <ol>{statements.map((statement, index) => <li key={statement}><span>{index + 1}</span><p>{statement}</p></li>)}</ol> : <div className="invalid-box">Complete valid inputs to generate the Decision Lens.</div>}
    </section>
  )
}
