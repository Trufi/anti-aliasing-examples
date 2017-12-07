import { ShaderProgram, Shader, Buffer } from '2gl';
import * as mat4 from '@2gis/gl-matrix/mat4';

const vertexCode = `
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

const fragmentCode = `
precision mediump float;
// varying vec3 v_color;
void main(void) {
    // gl_FragColor = vec4(v_color.rgb, 1.0);
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`;

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

    private program: ShaderProgram<{}, {}>;
    private vertexBuffer: Buffer;
    private gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;

        this.program = new ShaderProgram({
            vertex: new Shader('vertex', vertexCode),
            fragment: new Shader('fragment', fragmentCode),
            uniforms: [
                {name: 'u_cube', type: 'mat4'},
                {name: 'u_camera', type: 'mat4'},
            ],
            attributes: [
                {name: 'a_position'},
            ],
        });

        this.vertexBuffer = new Buffer(new Float32Array(lineVertices));
        this.matrix = new Float32Array(mat4.create());
    }

    public render(cameraMatrix: Float32Array) {
        const gl = this.gl;

        this.program
            .enable(gl)
            .bind(gl, {
                u_cube: this.matrix,
                u_camera: cameraMatrix,
            }, {
                a_position: this.vertexBuffer,
            });

        gl.drawArrays(gl.LINES, 0, lineVertices.length / 3);
    }

    public update(dt: number, inverse: boolean) {
        const angle = (inverse ? -dt : dt) / 10000;
        // Вращаем куб относительно оси Y
        mat4.rotateY(this.matrix, this.matrix, angle);
        // Вращаем куб относительно оси Z
        mat4.rotateZ(this.matrix, this.matrix, angle);
    }
}
