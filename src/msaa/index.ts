import { Cube } from '../utils/cube';
import { MSAAPlane } from './plane';
import * as mat4 from '@2gis/gl-matrix/mat4';

function createMSAAFrameBuffer(gl: any, size: number[]) {
    const texture = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    const frameColorBuffer = gl.createFramebuffer() as WebGLFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameColorBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const frameRenderBuffer = gl.createFramebuffer() as WebGLFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameRenderBuffer);

    const colorRenderBuffer = gl.createRenderbuffer() as WebGLRenderbuffer;
    gl.bindRenderbuffer(gl.RENDERBUFFER, colorRenderBuffer);
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 4, gl.RGBA8, size[0], size[1]);

    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorRenderBuffer);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return {
        texture,
        frameColorBuffer,
        frameRenderBuffer,
        colorRenderBuffer,
    };
}

export class MSAAExample {
    public canvas: HTMLCanvasElement;

    private gl: WebGLRenderingContext;
    private size: number[];
    private cube: Cube;
    private aliasedCube: Cube;
    private msaaPlane: MSAAPlane;
    private msaaData: { texture: WebGLTexture; frameColorBuffer: WebGLFramebuffer; frameRenderBuffer: WebGLFramebuffer;
        colorRenderBuffer: WebGLRenderbuffer; };

    constructor(size: number[]) {
        const canvas = this.canvas = document.createElement('canvas');
        canvas.width = size[0];
        canvas.height = size[1];

        this.size = size;

        const gl = this.gl = canvas.getContext('webgl2', {
            antialias: false,
        }) as WebGLRenderingContext;

        gl.viewport(0, 0, size[0], size[1]);

        this.msaaData = createMSAAFrameBuffer(gl, size);
        this.msaaPlane = new MSAAPlane(gl);

        this.cube = new Cube(gl);
        mat4.translate(this.cube.matrix, this.cube.matrix, [-2, 0, 0]);

        this.aliasedCube = new Cube(gl);
        mat4.translate(this.aliasedCube.matrix, this.aliasedCube.matrix, [2, 0, 0]);
    }

    public render(cameraMatrix: Float32Array) {
        const gl = this.gl as any;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.msaaData.frameRenderBuffer);
        gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 0.0]);

        gl.enable(gl.DEPTH_TEST);

        this.cube.render(cameraMatrix);

        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.msaaData.frameRenderBuffer);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.msaaData.frameColorBuffer);
        gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 0.0]);
        gl.blitFramebuffer(
            0, 0, this.size[0], this.size[1],
            0, 0, this.size[0], this.size[1],
            gl.COLOR_BUFFER_BIT, gl.NEAREST,
        );

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.aliasedCube.render(cameraMatrix);
        this.msaaPlane.render(this.msaaData.texture);
    }

    public update(dt: number) {
        this.cube.update(dt, false);
        this.aliasedCube.update(dt, true);
    }
}
