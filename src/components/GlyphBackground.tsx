// Glyph Background, adapted from 21st.dev (@skyleen77/backgrounds-glyph).
// Same shader and behaviour; motion/animate-ui swapped for requestAnimationFrame so it ships with zero dependencies.
// A field of characters lit by drifting glows, a trail under the cursor and ripple waves on click.
import * as React from 'react';

const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const MAX_WAVES = 12;
const TRAIL = 12;
const TRAIL_LIFE = 700;
const WAVE_LIFE = 4;
const WAVE_GAP = 0.3;
const WAVE_SPEED = 560;
const WAVE_SLOWDOWN = 0.66;
const WAVE_EDGE = 10;
const WAVE_TAIL = 30;
const DRIFT = [-30, 12] as const;
const ACTIVITY_DECAY = 900;

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAGMENT = `
precision highp float;
uniform sampler2D atlas;
uniform vec2 size;
uniform vec2 cell;
uniform float dpr;
uniform float count;
uniform float time;
uniform float rest;
uniform float haze;
uniform float hoverInk;
uniform float activity;
uniform vec2 drift;
uniform vec3 color;
uniform vec3 accent;
uniform vec4 waves[${MAX_WAVES * 2}];
uniform vec4 trail[${TRAIL}];

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float outline(float kind, float angle, float phase) {
  if (kind < 0.5) return 1.0;
  if (kind < 1.5) {
    float s = sin(angle);
    float c = cos(angle);
    return (2.0 - 2.0 * s + s * sqrt(abs(c)) / (s + 1.4)) * 0.42;
  }
  return 1.0 + 0.14 * sin(3.0 * angle + phase) + 0.08 * sin(5.0 * angle - phase * 1.3);
}

void main() {
  vec2 pixel = vec2(gl_FragCoord.x, size.y - gl_FragCoord.y);
  vec2 index = floor(pixel / cell);
  vec2 point = (index + 0.5) * cell / dpr;

  float ring = 0.0;
  for (int i = 0; i < ${MAX_WAVES}; i++) {
    vec4 a = waves[i * 2];
    vec4 b = waves[i * 2 + 1];
    if (a.w <= 0.0) continue;
    vec2 v = point - a.xy;
    float angle = atan(-v.y, v.x);
    float shape = mix(1.0, outline(b.x, angle, b.z), b.y);
    shape *= 1.0 + 0.07 * sin(3.0 * angle + b.z + b.w) + 0.05 * sin(5.0 * angle - b.z * 1.7 - b.w * 1.3) + 0.03 * sin(9.0 * angle + b.w * 2.1);
    float d = length(v) - a.z * shape;
    float k = d > 0.0 ? d / ${WAVE_EDGE.toFixed(1)} : d / ${WAVE_TAIL.toFixed(1)};
    ring = max(ring, exp(-k * k) * a.w);
  }

  float hover = 0.0;
  for (int i = 0; i < ${TRAIL}; i++) {
    vec4 t = trail[i];
    if (t.w <= 0.0) continue;
    vec2 v = point - t.xy;
    hover += t.w * exp(-dot(v, v) / (2.0 * t.z * t.z));
  }
  hover = min(hover, 1.0);

  mat2 turn = mat2(0.82, 0.57, -0.57, 0.82);
  vec2 q = turn * (point - drift);
  float blob = smoothNoise(vec2(q.x / 140.0, q.y / 80.0) + vec2(time * 0.04, 0.0)) * 0.62
    + smoothNoise(vec2(q.x / 62.0, q.y / 36.0) + vec2(3.7, time * 0.06)) * 0.38;
  float grain = smoothNoise(vec2(q.x / 30.0, q.y / 14.0) + vec2(time * 0.2, 7.3));
  float cloud = blob * (0.82 + 0.24 * grain);
  float mask = pow(smoothstep(0.47 - 0.2 * activity, 0.84, cloud), 2.6);

  float seed = hash(index);
  float epoch = floor(time * 0.08 * (0.4 + seed) + seed * 97.0);
  float character = floor(hash(index + epoch * 0.137) * count);
  vec2 local = fract(pixel / cell);
  float ink = pow(texture2D(atlas, vec2((character + local.x) / count, local.y)).a, 1.7);

  float grey = ink * clamp(rest + haze * mask * (1.0 + 0.3 * activity) + hoverInk * hover * (0.6 + 0.4 * mask), 0.0, 1.0);
  float glow = ink * ring * 0.72;
  float alpha = grey + glow - grey * glow;
  vec3 tint = color * grey * (1.0 - glow) + accent * glow;
  gl_FragColor = vec4(tint, alpha);
}
`;

type Wave = { x: number; y: number; kind: number; phase: number; strength: number; start: number };

export type GlyphBackgroundProps = React.ComponentProps<'div'> & {
  glowColor?: string;  // characters lit by the drifting glow and the cursor
  shapeColor?: string; // click ripples
  fontSize?: number;
  haze?: number;       // how bright the drifting glow gets
  hoverInk?: number;   // how bright the cursor trail gets
  interactive?: boolean;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function toRgb(color: string): [number, number, number] {
  const probe = document.createElement('canvas').getContext('2d');
  if (!probe) return [0.9, 0.9, 0.9];
  probe.fillStyle = color;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

function drawAtlas(cellWidth: number, cellHeight: number, font: string) {
  const atlas = document.createElement('canvas');
  atlas.width = Math.ceil(cellWidth * CHARACTERS.length);
  atlas.height = Math.ceil(cellHeight);
  const ctx = atlas.getContext('2d')!;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  for (let i = 0; i < CHARACTERS.length; i++) ctx.fillText(CHARACTERS[i], (i + 0.5) * cellWidth, cellHeight / 2);
  return atlas;
}

type Frame = {
  width: number; height: number; dpr: number; cell: [number, number]; time: number; activity: number;
  drift: [number, number]; color: [number, number, number]; accent: [number, number, number];
  waves: Float32Array; trail: Float32Array;
};

function createRenderer(gl: WebGLRenderingContext, haze: number, hoverInk: number) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const at = (name: string) => gl.getUniformLocation(program, name);
  const u = {
    size: at('size'), cell: at('cell'), dpr: at('dpr'), time: at('time'), activity: at('activity'),
    drift: at('drift'), color: at('color'), accent: at('accent'), waves: at('waves'), trail: at('trail'),
  };
  gl.uniform1i(at('atlas'), 0);
  gl.uniform1f(at('count'), CHARACTERS.length);
  gl.uniform1f(at('rest'), 0);
  gl.uniform1f(at('haze'), haze);
  gl.uniform1f(at('hoverInk'), hoverInk);

  return {
    atlas(image: HTMLCanvasElement) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    },
    draw(f: Frame) {
      gl.viewport(0, 0, f.width, f.height);
      gl.uniform2f(u.size, f.width, f.height);
      gl.uniform2f(u.cell, ...f.cell);
      gl.uniform1f(u.dpr, f.dpr);
      gl.uniform1f(u.time, f.time);
      gl.uniform1f(u.activity, f.activity);
      gl.uniform2f(u.drift, ...f.drift);
      gl.uniform3f(u.color, ...f.color);
      gl.uniform3f(u.accent, ...f.accent);
      gl.uniform4fv(u.waves, f.waves);
      gl.uniform4fv(u.trail, f.trail);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  };
}

export default function GlyphBackground({
  glowColor = '#8fe3b4',
  shapeColor = '#2fe37f',
  fontSize = 12,
  haze = 0.3,
  hoverInk = 0.6,
  interactive = true,
  className = '',
  children,
  ...props
}: GlyphBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const waves = React.useRef<Wave[]>([]);
  const trailPts = React.useRef<{ x: number; y: number; t: number }[]>([]);
  const time = React.useRef(0);
  const energy = React.useRef({ value: 0, at: 0 });
  const reduce = React.useRef(false);

  React.useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false });
    const renderer = gl && createRenderer(gl, haze, hoverInk);
    if (!renderer) return; // no WebGL: the page simply has a plain dark hero

    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
    reduce.current = motionQuery.matches;
    const color = toRgb(glowColor);
    const accent = toRgb(shapeColor);
    const waveData = new Float32Array(MAX_WAVES * 8);
    const trailData = new Float32Array(TRAIL * 4);
    let width = 0, height = 0, dpr = 1;
    let cell: [number, number] = [7, 13];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.max(1, Math.min(devicePixelRatio || 1, 2));
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      const font = `${fontSize * dpr}px "Geist Mono Variable", ui-monospace, Consolas, monospace`;
      const measure = document.createElement('canvas').getContext('2d')!;
      measure.font = font;
      cell = [Math.round(measure.measureText('0').width), Math.round(fontSize * 1.25 * dpr)];
      renderer.atlas(drawAtlas(cell[0], cell[1], font));
    };

    const draw = () => {
      if (!width || !height) return;
      const now = time.current;
      waveData.fill(0);
      waves.current = waves.current.filter((w) => (now - w.start) / 1000 < WAVE_LIFE);
      waves.current.forEach((w, i) => {
        const age = (now - w.start) / 1000;
        if (age <= 0) return;
        const radius = (WAVE_SPEED * age) / (1 + WAVE_SLOWDOWN * age);
        const fade = Math.min(1, age / 0.05) * Math.exp(-Math.max(0, age - 0.4) / 1.3) * Math.min(1, (WAVE_LIFE - age) / 0.5);
        waveData.set([w.x, w.y, radius, fade * w.strength, w.kind, 0.12 + 0.5 * Math.min(1, age / 2.2), w.phase, age * 3], i * 8);
      });
      trailData.fill(0);
      trailPts.current.forEach((p, i) => {
        const age = (now - p.t) / TRAIL_LIFE;
        if (age < 0 || age >= 1) return;
        trailData.set([p.x, p.y, 40 + 25 * age, 0.3 * (1 - age) * (1 - age)], i * 4);
      });
      const seconds = now / 1000;
      const activity = energy.current.value * Math.exp(-Math.max(0, now - energy.current.at) / ACTIVITY_DECAY);
      renderer.draw({
        width: canvas.width, height: canvas.height, dpr, cell, time: seconds, activity,
        drift: [DRIFT[0] * seconds, DRIFT[1] * seconds], color, accent, waves: waveData, trail: trailData,
      });
    };

    // fonts change the glyph width: redraw the atlas once they're in
    document.fonts?.ready.then(() => { resize(); draw(); });
    resize();
    time.current = 4000; // start mid-drift, not from a blank frame
    draw();
    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(container);

    // only animate while visible on screen, in a visible tab, with motion allowed
    let inView = true, raf = 0, last = 0;
    const loop = (t: number) => {
      time.current += Math.min(t - (last || t), 64);
      last = t;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const update = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (inView && !document.hidden && !reduce.current) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; update(); });
    io.observe(container);
    const onMotion = () => { reduce.current = motionQuery.matches; update(); };
    motionQuery.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', update);
    update();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      motionQuery.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', update);
    };
  }, [glowColor, shapeColor, fontSize, haze, hoverInk]);

  const point = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      {...props}
      onPointerMove={(e) => {
        if (!interactive || reduce.current) return;
        const { x, y } = point(e);
        const now = time.current;
        const pts = trailPts.current;
        const lastPt = pts[pts.length - 1];
        const moved = lastPt ? Math.hypot(x - lastPt.x, y - lastPt.y) : 0;
        const current = energy.current.value * Math.exp(-Math.max(0, now - energy.current.at) / ACTIVITY_DECAY);
        energy.current = { value: Math.min(1, current + moved / 600), at: now };
        if (lastPt && moved < 18) return;
        trailPts.current = [...pts.filter((p) => now - p.t < TRAIL_LIFE).slice(1 - TRAIL), { x, y, t: now }];
      }}
      onPointerDown={(e) => {
        if (!interactive || reduce.current) return;
        const { x, y } = point(e);
        const kind = 1 + Math.floor(Math.random() * 2);
        const phase = Math.random() * Math.PI * 2;
        const now = time.current;
        for (const [delay, strength] of [[0, 1], [WAVE_GAP, 0.55]] as const) {
          waves.current = [...waves.current.slice(1 - MAX_WAVES), { x, y, kind, phase, strength, start: now + delay * 1000 }];
        }
      }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      {children}
    </div>
  );
}
