import {ImageResponse} from 'next/og'

export const alt = 'Integrative Wellbeing & Chiropractic: Pain | Performance | Prevention'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

/** Default social sharing card (pages can override it with an image in the CMS). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0b1f4a', padding: 80, color: '#fff'}}>
        <div style={{display: 'flex', fontSize: 26, letterSpacing: 8, color: '#c9a673'}}>PAIN | PERFORMANCE | PREVENTION</div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{fontSize: 74, lineHeight: 1.05, fontFamily: 'serif', maxWidth: 980}}>When the same problem keeps coming back, look at the whole picture.</div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{fontSize: 40, fontFamily: 'serif'}}>Integrative Wellbeing</div>
            <div style={{fontSize: 18, letterSpacing: 8, color: '#c9a673', marginTop: 6}}>&amp; CHIROPRACTIC</div>
          </div>
          <div style={{fontSize: 24, color: '#a8d4f8'}}>Wayne, PA · Philadelphia Main Line</div>
        </div>
      </div>
    ),
    size,
  )
}
