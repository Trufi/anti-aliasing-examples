import { createProrgam } from './program';
import * as mat4 from '@2gis/gl-matrix/mat4';

const cubeVertexCode = `
attribute vec3 a_position;
// attribute vec3 a_color;
uniform mat4 u_cube;
uniform mat4 u_camera;
// varying vec3 v_color;
void main(void) {
    // v_color = a_color;
    gl_Position = u_camera * u_cube * vec4(a_position, 1.0);
}
`;

const cubeFragmentCode = `
precision mediump float;
// varying vec3 v_color;
void main(void) {
    // gl_FragColor = vec4(v_color.rgb, 1.0);
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`;

// const vertices = [
//     // Передняя грань
//     -1, -1, -1,
//     1, -1, -1,
//     -1, -1, 1,

//     1, -1, 1,
//     -1, -1, 1,
//     1, -1, -1,

//     // Задняя грань
//     -1, 1, -1,
//     -1, 1, 1,
//     1, 1, -1,

//     1, 1, 1,
//     1, 1, -1,
//     -1, 1, 1,

//     // Нижняя грань
//     -1, -1, -1,
//     -1, 1, -1,
//     1, -1, -1,

//     1, 1, -1,
//     1, -1, -1,
//     -1, 1, -1,

//     // Верхняя грань
//     -1, -1, 1,
//     1, -1, 1,
//     -1, 1, 1,

//     1, 1, 1,
//     -1, 1, 1,
//     1, -1, 1,

//     // Левая грань
//     -1, -1, -1,
//     -1, -1, 1,
//     -1, 1, -1,

//     -1, 1, 1,
//     -1, 1, -1,
//     -1, -1, 1,

//     // Правая грань
//     1, -1, -1,
//     1, 1, -1,
//     1, -1, 1,

//     1, 1, 1,
//     1, -1, 1,
//     1, 1, -1,
// ];

const lineVertices = [
    // Передняя грань
    -1, -1, -1,
    1, -1, -1,
    1, -1, -1,
    1, -1, 1,
    1, -1, 1,
    -1, -1, 1,
    -1, -1, 1,
    -1, -1, -1,

    // Задняя грань
    -1, 1, -1,
    1, 1, -1,
    1, 1, -1,
    1, 1, 1,
    1, 1, 1,
    -1, 1, 1,
    -1, 1, 1,
    -1, 1, -1,

    // Доп линии
    -1, -1, -1,
    -1, 1, -1,
    1, -1, 1,
    1, 1, 1,
    -1, -1, 1,
    -1, 1, 1,
    1, -1, -1,
    1, 1, -1,
];

export class Cube {
    public matrix: Float32Array;

    private program: WebGLProgram;
    private vertexBuffer: WebGLBuffer;
    private aPosition: number;
    private uCamera: WebGLUniformLocation;
    private uCube: WebGLUniformLocation;
    private gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;

        this.program = createProrgam(gl, cubeVertexCode, cubeFragmentCode);

        // Получим местоположение переменных в программе шейдеров
        this.uCube = gl.getUniformLocation(this.program, 'u_cube') as WebGLUniformLocation;
        this.uCamera = gl.getUniformLocation(this.program, 'u_camera') as WebGLUniformLocation;
        this.aPosition = gl.getAttribLocation(this.program, 'a_position');

        this.vertexBuffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineVertices), gl.STATIC_DRAW);

        this.matrix = new Float32Array(mat4.create());
    }

    public render(cameraMatrix: Float32Array) {
        const gl = this.gl;

        gl.useProgram(this.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(this.aPosition);
        gl.vertexAttribPointer(this.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(this.uCube, false, this.matrix);
        gl.uniformMatrix4fv(this.uCamera, false, cameraMatrix);

        gl.drawArrays(gl.LINES, 0, lineVertices.length / 3);
    }
}
