// canvas bounds determine the canvas size to be able to render things based on the grid size
// just because canvas breaks trying to fit too many tiles if they're too big but there's no real way to determine that without just trial and erroring it
// grid_size: [tile_size, outline_width]
const canvas_bounds = {
    125: [100, 7],
    150: [100, 6],
    175: [90, 6],
    200: [80, 6],
    225: [70, 5],
    250: [60, 4],
    275: [50, 4],
    325: [50, 3],
    375: [40, 3],
    400: [40, 2],
    475: [30, 2],
    500: [20, 1]
}
export default canvas_bounds