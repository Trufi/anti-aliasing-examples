import { Cube } from '../utils/cube';
import { createFrameBuffer } from '../utils/framebuffer';
import { FXAAPlane } from './plane';

export class FXAAExample {
    public canvas: HTMLCanvasElement;

    private gl: WebGLRenderingContext;
    private cube: Cube;
    private frameBufferData: { texture: WebGLTexture; frameBuffer: WebGLFramebuffer; renderBuffer: WebGLRenderbuffer; };
    private fxaaPlane: FXAAPlane;

    constructor(size: number[]) {
        const canvas = this.canvas = document.createElement('canvas');
        canvas.width = size[0];
        canvas.height = size[1];

        const gl = this.gl = canvas.getContext('webgl', {
            antialias: false,
        }) as WebGLRenderingContext;

        gl.viewport(0, 0, size[0], size[1]);

        this.cube = new Cube(gl);
        this.fxaaPlane = new FXAAPlane(gl, size);

        this.frameBufferData = createFrameBuffer(gl, size, gl.RGBA);
    }

    public render(cameraMatrix: Float32Array) {
        const gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferData.frameBuffer);

        // Очищаем сцену, закрашивая её в белый цвет
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

        // Включаем фильтр глубины
        // gl.enable(gl.DEPTH_TEST);

        this.cube.render(cameraMatrix);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.fxaaPlane.render(this.frameBufferData.texture);
    }
}
