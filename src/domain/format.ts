export const formatCad = (value: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value)

export const formatUsd = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export const formatRate = (value: number) =>
  Number.isFinite(value) ? value.toFixed(4) : '—'

export const formatPercent = (value: number) =>
  Number.isFinite(value) ? `${(value * 100).toFixed(2)}%` : '—'
