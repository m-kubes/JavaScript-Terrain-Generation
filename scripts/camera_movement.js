const canvas = document.getElementById('main-canvas');

let currentZoom = 1;
const minZoom = 0.5;
const maxZoom = 10;
const stepSize = 0.3;


document.addEventListener("wheel", function(event) {
    // scroll direction
    const direction = event.deltaY < 0 ? 1 : -1; 
    
    // new zoom level
    const newZoom = currentZoom + direction * stepSize;

    // clamp the zoom level within min/max bounds
    if (newZoom >= minZoom && newZoom <= maxZoom) {
        currentZoom = newZoom;
        // Apply the new scale using CSS transform
        canvas.style.transform = `scale(${currentZoom})`; 
    }
});