import * as mat4 from '@2gis/gl-matrix/mat4';
import { GUI } from 'dat-gui';

const config = {
    rotation: true,
};

import { SimpleExample } from './simple';
import { FXAAExample } from './fxaa';
import { SMAAExample } from './smaa';
import { MSAAExample } from './msaa';

const examplesSize = [500, 500];

const cameraMatrix = new Float32Array(mat4.create());
mat4.perspective(cameraMatrix, 45, examplesSize[0] / examplesSize[1], 0.1, 1000);
mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -5]);

const examples = [
    new SimpleExample(examplesSize),
    new FXAAExample(examplesSize),
    new SMAAExample(examplesSize),
    new MSAAExample(examplesSize),
];

examples.forEach((example) => {
    const h1 = document.createElement('h1');
    h1.innerHTML = example.constructor.name;
    document.body.appendChild(h1);
    document.body.appendChild(example.canvas);
});

let lastTime = Date.now();

function loop() {
    requestAnimationFrame(loop);

    const time = Date.now();
    const dt = time - lastTime;

    if (config.rotation) {
        // Вращаем куб относительно оси Y
        mat4.rotateY(cameraMatrix, cameraMatrix, dt / 10000);
        // Вращаем куб относительно оси Z
        mat4.rotateZ(cameraMatrix, cameraMatrix, dt / 10000);
    }

    examples.forEach((example) => example.render(cameraMatrix));

    lastTime = time;
}

requestAnimationFrame(loop);

const gui = new GUI();
gui.add(config, 'rotation');
