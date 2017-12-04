export const planeVertexCode = `
attribute vec3 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main(void) {
    v_uv = a_uv;
    gl_Position = vec4(a_position.xy, 0.0, 1.0);
}
`;

export const planeFragmentCode = `
precision mediump float;
uniform sampler2D u_sampler;
varying vec2 v_uv;
void main(void) {
    gl_FragColor = texture2D(u_sampler, v_uv);
    // gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`;

export const planeVertices = [
    -1, -1, 0,
    1, -1, 0,
    1, 1, 0,

    -1, -1, 0,
    1, 1, 0,
    -1, 1, 0,
];

export const planeUV = [
    0, 0,
    1, 0,
    1, 1,
    0, 0,
    1, 1,
    0, 1,
];
