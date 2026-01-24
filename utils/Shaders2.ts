export const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fluidFragmentShader = `
uniform sampler2D uPrevTrails;
uniform vec2 uMouse;
uniform vec2 uPrevMouse;
uniform float uDecay;
uniform bool uIsMoving;
varying vec2 vUv;

void main() {
  vec4 prev = texture2D(uPrevTrails, vUv);
  float value = prev.r * uDecay;

  if (uIsMoving) {
    vec2 dir = uMouse - uPrevMouse;
    float len = length(dir);
    if (len > 0.0001) {
      vec2 d = dir / len;
      vec2 toPix = vUv - uPrevMouse;
      float proj = clamp(dot(toPix, d), 0.0, len);
      vec2 closest = uPrevMouse + proj * d;
      float dist = length(vUv - closest);
      float width = 0.08;
      value += smoothstep(width, 0.0, dist) * 0.6;
    }
  }

  gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
}
`;

export const displayFragmentShader = `
uniform sampler2D uFluid;
uniform sampler2D uTopTexture;
uniform sampler2D uBottomTexture;
uniform vec2 uResolution;
uniform vec2 uTopTexSize;
uniform vec2 uBottomTexSize;

varying vec2 vUv;

vec2 coverUV(vec2 uv, vec2 texSize) {
  vec2 s = uResolution / texSize;
  float scale = min(s.x, s.y);
  vec2 scaled = texSize * scale;
  vec2 offset = (uResolution - scaled) * 0.5;
  return (uv * uResolution - offset) / scaled;
}

void main() {
  float fluid = texture2D(uFluid, vUv).r;

  vec2 uvTop = coverUV(vUv, uTopTexSize);
  vec2 uvBot = coverUV(vUv, uBottomTexSize);

  vec4 base = texture2D(uBottomTexture, uvBot);
  vec4 reveal = texture2D(uTopTexture, uvTop);

  float edge = smoothstep(0.02, 0.12, fluid);
  gl_FragColor = mix(base, reveal, edge);
}
`;
