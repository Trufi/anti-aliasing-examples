import * as mat4 from '@2gis/gl-matrix/mat4';
import { Cube } from '../utils/cube';
import { createFrameBuffer } from '../utils/framebuffer';
import { FXAAPlane } from './plane';

export function createFXAA(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const size = [canvas.width, canvas.height];
    const gl = canvas.getContext('webgl', {
        antialias: false,
    }) as WebGLRenderingContext;

    gl.viewport(0, 0, size[0], size[1]);

    const cube = new Cube(gl);
    const fxaaPlane = new FXAAPlane(gl, size);

    const cameraMatrix = new Float32Array(mat4.create());
    mat4.perspective(cameraMatrix, 45, size[0] / size[1], 0.1, 1000);
    mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -5]);

    // Запомним время последней отрисовки кадра
    let lastRenderTime = Date.now();

    const frameBufferData = createFrameBuffer(gl, size, gl.RGBA);

    function render() {
        // Запрашиваем рендеринг на следующий кадр
        requestAnimationFrame(render);

        // Получаем время прошедшее с прошлого кадра
        const time = Date.now();
        const dt = lastRenderTime - time;

        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBufferData.frameBuffer);

        // Очищаем сцену, закрашивая её в белый цвет
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Включаем фильтр глубины
        gl.enable(gl.DEPTH_TEST);

        cube.render(cameraMatrix, dt);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        fxaaPlane.render(frameBufferData.texture);

        lastRenderTime = time;
    }

    render();
}
