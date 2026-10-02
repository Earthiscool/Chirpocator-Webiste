import {stegaClean} from 'next-sanity'

/**
 * Signature graphic: the "whole picture".
 * Every factor connects to others (the complexity patients feel), then the
 * web quiets and a few factors light up — "the pieces that matter for you".
 * Pure SVG + CSS animation; static under prefers-reduced-motion.
 */
const W = 600
const H = 520
const CENTER = {x: 300, y: 262}
const SLOTS: [number, number][] = [
  [168, 112],
  [318, 60],
  [452, 132],
  [462, 300],
  [380, 440],
  [226, 452],
  [150, 352],
  [246, 252],
  [382, 236],
  [118, 232],
]

export function WholePictureMap({factors, highlighted}: {factors: string[]; highlighted: string[]}) {
  const labels = factors.slice(0, SLOTS.length).map((f) => stegaClean(f))
  const focus = new Set(highlighted.map((h) => stegaClean(h)))
  const nodes = labels.map((label, i) => ({label, x: SLOTS[i][0], y: SLOTS[i][1], focus: focus.has(label)}))

  // A web of connections: every node links to its nearer neighbours.
  const edges: {a: number; b: number; len: number}[] = []
  for (let a = 0; a < nodes.length; a++) {
    for (let b = a + 1; b < nodes.length; b++) {
      const len = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y)
      if (len < 270) edges.push({a, b, len})
    }
  }
  const focusIdx = nodes.map((n, i) => (n.focus ? i : -1)).filter((i) => i >= 0)
  const focusEdges: {a: number; b: number; len: number}[] = []
  for (let i = 0; i < focusIdx.length; i++)
    for (let j = i + 1; j < focusIdx.length; j++) {
      const a = focusIdx[i]
      const b = focusIdx[j]
      focusEdges.push({a, b, len: Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y)})
    }

  const description = `Illustration: ${labels.join(', ')} are all connected. ${
    focusIdx.length ? `${focusIdx.map((i) => labels[i]).join(', ')} are highlighted as an example of the few pieces that matter most for one person.` : ''
  }`

  const labelPos = (n: (typeof nodes)[number]) => {
    const dx = n.x - CENTER.x
    const dy = n.y - CENTER.y
    const d = Math.hypot(dx, dy) || 1
    const off = n.focus ? 30 : 24
    const x = n.x + (dx / d) * off
    const y = n.y + (dy / d) * off + 6
    const anchor = Math.abs(dx) < 60 ? 'middle' : dx > 0 ? 'start' : 'end'
    return {x, y, anchor: anchor as 'middle' | 'start' | 'end'}
  }

  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={description} className="h-auto w-full overflow-visible">
        <defs>
          <radialGradient id="map-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#c9a673" stopOpacity="0.45" />
            <stop offset="1" stopColor="#c9a673" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* The whole web — draws in, then quiets */}
        <g className="map-dim" aria-hidden>
          {edges.map((e, i) => (
            <line
              key={`e${i}`}
              x1={nodes[e.a].x}
              y1={nodes[e.a].y}
              x2={nodes[e.b].x}
              y2={nodes[e.b].y}
              stroke="#a8d4f8"
              strokeOpacity="0.38"
              strokeWidth="1"
              className="map-line"
              style={{'--len': Math.ceil(e.len), '--d': `${i * 28}ms`} as React.CSSProperties}
            />
          ))}
          {nodes.map((n, i) => {
            if (n.focus) return null
            const lp = labelPos(n)
            return (
              <g key={`n${i}`} className="map-node" style={{'--d': `${300 + i * 60}ms`} as React.CSSProperties}>
                <circle cx={n.x} cy={n.y} r="4.5" fill="#0b1f4a" stroke="#a8d4f8" strokeWidth="1.25" />
                <text
                  x={lp.x}
                  y={lp.y}
                  textAnchor={lp.anchor}
                  fill="#dfe5f0"
                  fontSize="19"
                  letterSpacing="0.06em"
                  style={{fontFamily: 'var(--font-hanken)', textTransform: 'uppercase', fontWeight: 500}}
                >
                  {n.label}
                </text>
              </g>
            )
          })}
        </g>

        {/* The pieces that matter — connect last */}
        <g aria-hidden>
          {focusEdges.map((e, i) => (
            <line
              key={`f${i}`}
              x1={nodes[e.a].x}
              y1={nodes[e.a].y}
              x2={nodes[e.b].x}
              y2={nodes[e.b].y}
              stroke="#c9a673"
              strokeWidth="2"
              strokeLinecap="round"
              className="map-focus"
              style={{'--len': Math.ceil(e.len), '--d': `${i * 180}ms`} as React.CSSProperties}
            />
          ))}
          {nodes.map((n, i) => {
            if (!n.focus) return null
            const lp = labelPos(n)
            return (
              <g key={`h${i}`} className="map-node" style={{'--d': `${300 + i * 60}ms`} as React.CSSProperties}>
                <circle cx={n.x} cy={n.y} r="34" fill="url(#map-halo)" className="map-glow" />
                <circle cx={n.x} cy={n.y} r="7.5" fill="#c9a673" />
                <circle cx={n.x} cy={n.y} r="13" fill="none" stroke="#c9a673" strokeOpacity="0.55" strokeWidth="1" className="map-glow" />
                <text
                  x={lp.x}
                  y={lp.y}
                  textAnchor={lp.anchor}
                  fill="#ffffff"
                  fontSize="27"
                  style={{fontFamily: 'var(--font-newsreader)', fontStyle: 'italic', fontWeight: 420}}
                >
                  {n.label}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
      <figcaption className="map-glow mt-4 flex items-start gap-3 text-sm leading-snug text-navy-100">
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-gold-400" aria-hidden />
        <span>
          <span className="font-semibold text-white">The pieces that matter for you.</span> An example — every plan starts with your
          story, not a template.
        </span>
      </figcaption>
    </figure>
  )
}
