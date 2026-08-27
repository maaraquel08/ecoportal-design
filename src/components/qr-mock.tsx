/**
 * A visually convincing but non-functional QR block for prototypes:
 * real finder patterns, alignment pattern and timing rows, with the
 * data modules filled from a fixed seed so it never re-shuffles
 * between renders. Ported from the design canvas prototype.
 */
export function QrMock({
  size = 214,
  /** Scale to the height of the box instead of a fixed size. */
  fill,
}: {
  size?: number;
  fill?: boolean;
}) {
  const N = 29;
  const quiet = 2;
  const total = N + quiet * 2;
  const on: [number, number][] = [];

  const finder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        if (edge || core) on.push([ox + x, oy + y]);
      }
    }
  };

  const reserved = (x: number, y: number) =>
    (x < 8 && y < 8) ||
    (x > N - 9 && y < 8) ||
    (x < 8 && y > N - 9) ||
    (x >= N - 9 && x <= N - 5 && y >= N - 9 && y <= N - 5);

  let seed = 20260827;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (reserved(x, y)) continue;
      if (rnd() > 0.5) on.push([x, y]);
    }
  }

  finder(0, 0);
  finder(N - 7, 0);
  finder(0, N - 7);

  for (let y = N - 9; y <= N - 5; y++) {
    for (let x = N - 9; x <= N - 5; x++) {
      const edge = x === N - 9 || y === N - 9 || x === N - 5 || y === N - 5;
      if (edge || (x === N - 7 && y === N - 7)) on.push([x, y]);
    }
  }

  for (let i = 8; i < N - 8; i++) {
    if (i % 2 === 0) {
      on.push([i, 6]);
      on.push([6, i]);
    }
  }

  return (
    <svg
      {...(fill ? {} : { width: size, height: size })}
      className={fill ? "h-full w-auto max-w-full" : undefined}
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Visitor pass QR code"
    >
      <rect x={0} y={0} width={total} height={total} className="fill-bg" />
      {on.map(([x, y], i) => (
        <rect
          key={i}
          x={x + quiet}
          y={y + quiet}
          width={1}
          height={1}
          className="fill-fg"
        />
      ))}
    </svg>
  );
}
