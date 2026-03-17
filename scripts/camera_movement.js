const canvas = document.getElementById('main-canvas');

let currentZoom = 1;
let currentDragOffsetX = 0
let currentDragOffsetY = 0
const minZoom = 0.5;
const maxZoom = 10;
const stepSize = 0.3;


// one update function so we only set canvas transform in one spot
function updateCanvas() {
    canvas.style.scale = currentZoom
    canvas.style.translate = `${currentDragOffsetX}px ${currentDragOffsetY}px`
}


document.addEventListener("wheel", (event) => {
    // scroll direction
    const direction = event.deltaY < 0 ? 1 : -1; 
    
    // new zoom level
    const newZoom = currentZoom + direction * stepSize;

    // clamp the zoom level within min/max bounds
    if (newZoom >= minZoom && newZoom <= maxZoom) {
        currentZoom = newZoom;
        // update the canvas
        updateCanvas()
    }
});


document.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) {
        currentDragOffsetX = currentDragOffsetX + (event.movementX);
        currentDragOffsetY = currentDragOffsetY + (event.movementY);

        // update the canvas
        updateCanvas()
    }
})