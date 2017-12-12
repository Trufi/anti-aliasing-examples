import { ShaderProgram, Shader, Buffer } from '2gl';
import { planeVertices, planeUV } from '../utils/plane';

// http://www.realtimerendering.com/blog/webgl-2-new-features/

const vertexCode = `
precision highp float;
precision highp int;
attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;
void main(void) {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentCode = `
precision highp float;
precision highp int;
uniform sampler2D tDiffuse;
varying vec2 vUv;
void main(void) {
    gl_FragColor = texture2D(tDiffuse, vUv);
}
`;

export class MSAAPlane {
    private gl: WebGLRenderingContext;
    private program: ShaderProgram;
    private vertexBuffer: Buffer;
    private uVBuffer: Buffer;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;

        this.vertexBuffer = new Buffer(new Float32Array(planeVertices));
        this.uVBuffer = new Buffer(new Float32Array(planeUV), {
            itemSize: 2,
        });

        this.program = new ShaderProgram({
            vertex: new Shader('vertex', vertexCode),
            fragment: new Shader('fragment', fragmentCode),
            uniforms: [
                {name: 'tDiffuse', type: '1i'},
            ],
            attributes: [
                {name: 'position'},
                {name: 'uv'},
            ],
        });
    }

    public render(readTexture: WebGLTexture) {
        const gl = this.gl;

        // gl.clearColor(0.5, 0.0, 0.0, 1.0);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, readTexture);

        this.program
            .enable(gl)
            .bind(gl, {
                tDiffuse: 0,
            }, {
                position: this.vertexBuffer,
                uv: this.uVBuffer,
            });

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}
