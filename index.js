import { BouncingDVDLogo } from "./Module/BouncingDVDLogo.js";

const container = document.getElementById('container');
const bouncingDVDLogo = new BouncingDVDLogo(container, 100, 50, 2)

// const animate = () => {
//     bouncingDVDLogo.move();
//     window.requestAnimationFrame(animate())
// }

// animate();

function animate() {
    bouncingDVDLogo.move();
    requestAnimationFrame(animate);
}

animate();