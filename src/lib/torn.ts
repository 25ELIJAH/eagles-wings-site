// Torn-paper edge: seeded multi-scale noise plus the odd deeper tear, so it never reads as a zigzag or a wave.
export function tornPath(seed: number, base: number, amp: number, step: number): string {
  let t = seed >>> 0;
  const rnd = () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  const ph = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
  const pts: string[] = [];
  for (let x = 0; x <= 1440; x += step) {
    const u = x / 1440;
    let y = base + Math.sin(u * 9 + ph[0]) * amp * 0.55 + Math.sin(u * 23 + ph[1]) * amp * 0.3 + Math.sin(u * 61 + ph[2]) * amp * 0.15;
    y += (rnd() - 0.5) * amp * 0.9;
    if (rnd() < 0.09) y += (rnd() - 0.3) * amp * 1.6;
    pts.push(`${x},${Math.max(4, y).toFixed(1)}`);
  }
  return `M0,200 L${pts.join(' L')} L1440,200 Z`;
}
