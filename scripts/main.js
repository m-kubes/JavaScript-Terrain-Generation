import TileDrawer from './tile_drawer.js';
import tiles from './tiles.json' with { type: "json" };

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext("2d");

const drawer = new TileDrawer(ctx, 100, 5)


for (let x = 0; x < 100; x++) {
    for (let z = 0; z < 100; z++) {
        drawer.draw_tile(x, 0, z, tiles['grass'])
    }
}