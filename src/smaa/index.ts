import { Cube } from '../utils/cube';
import { SMAAPlane } from './plane';
import { RenderTarget, Texture } from '2gl';

export class SMAAExample {
    public canvas: HTMLCanvasElement;

    private gl: WebGLRenderingContext;
    private cube: Cube;
    private smaaPlane: SMAAPlane;
    private renderTarget: RenderTarget;

    constructor(size: number[]) {
        const canvas = this.canvas = document.createElement('canvas');
        canvas.width = size[0];
        canvas.height = size[1];

        const gl = this.gl = canvas.getContext('webgl', {
            antialias: false,
        }) as WebGLRenderingContext;

        gl.viewport(0, 0, size[0], size[1]);

        this.cube = new Cube(gl);
        this.smaaPlane = new SMAAPlane(gl, size);

        this.renderTarget = new RenderTarget({size});
        this.renderTarget.texture.minFilter = Texture.LinearFilter;
    }

    public render(cameraMatrix: Float32Array) {
        const gl = this.gl;

        this.renderTarget.bind(gl);

        // Очищаем сцену, закрашивая её в белый цвет
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

        // Включаем фильтр глубины
        gl.enable(gl.DEPTH_TEST);

        this.cube.render(cameraMatrix);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.smaaPlane.render(this.renderTarget.texture);
    }
}
