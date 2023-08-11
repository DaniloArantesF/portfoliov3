
varying vec2 vUv;
uniform vec2 uResolution;
varying vec3 vPosition;
varying float vParticleY;
uniform float fft;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}


void main() {
    vec3 yellow = vec3(.8, .6, 0.0);
    vec3 orange = vec3(1.0, 0.65, 0.0);
    vec3 red = vec3(1.0, 0.0, 0.0);

    float particleIntensity = vParticleY - 2. * step(.7, fft);

    vec3 color1 = mix(yellow, orange, smoothstep(0.0, .1, particleIntensity));
    vec3 color2 = mix(orange, red, smoothstep(.5, 2.0, particleIntensity));
    vec3 finalColor = mix(color1, color2, step(0.5, particleIntensity));

    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);

    gl_FragColor = vec4(finalColor, step(ll, .5));
}