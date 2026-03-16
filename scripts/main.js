import TileDrawer from './tile_drawer.js';
import tiles from './tiles.json' with { type: "json" };

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext("2d");


const grid_width = 100
const grid_height = 100 
const tile_size = 100
const height_variance = 9
const canvas_padding = 5
const biome_zoom = 25

// center plain in the middle of the canvas and resize canvas to fit it
canvas.width = grid_width * tile_size + (canvas_padding * 2)
canvas.height = grid_height * tile_size + (canvas_padding * 2)
ctx.translate((grid_width * tile_size * 0.5) + canvas_padding, (grid_height * tile_size * 0.25) + canvas_padding)
const drawer = new TileDrawer(ctx, tile_size, 5)

// biome config
noise.seed(Math.random());


const scene_tiles = []

// make fatter edges
function make_edge(x, y, z, tile) {
    if (x == grid_width || z == grid_height) {
        const edge_tile = tile.edge_tile ?? tile
        for (let i = 1; i < y; i++) {
            console.log('a')
            scene_tiles.push([x,y-i,z,edge_tile])
        }
    }
}

for (let x = 0; x < grid_width; x++) {
    for (let z = 0; z < grid_height; z++) {
        const biome_noise_value = (noise.perlin2(x / biome_zoom, z / biome_zoom) + 1) / 2
        
        let y = Math.max(Math.floor(biome_noise_value * height_variance), 3)
        
        let tile
        if (biome_noise_value > 0.7) {
            tile = tiles['dark_stone']

            y += 2
            scene_tiles.push([x,y-1,z,tiles['dark_stone']])
            scene_tiles.push([x,y-2,z,tiles['dark_stone']])
        } else if (biome_noise_value > 0.645) {
            tile = tiles['stone']

            y += 1
            scene_tiles.push([x,y-1,z,tiles['stone']])
        } else if (biome_noise_value > 0.44) {
            tile = tiles['grass']
            
            // account for water gap when going from grass straight to water
            if (biome_noise_value < 0.6) {
                scene_tiles.push([x,y-1,z,tiles['dirt']])
            }
        } else if (biome_noise_value > 0.4) {
            tile = tiles['sand']
        } else {
            tile = tiles['water']
        }

        make_edge(x, y, z, tile)
        scene_tiles.push([x,y,z,tile])
    }
}

const sorted_tiles = scene_tiles.sort((a,b) => TileDrawer.sort_order(a) > TileDrawer.sort_order(b) ? 1 : -1)

for (let tile of sorted_tiles) {
    const [x,y,z,t] = tile
    drawer.draw_tile(x,y,z,t)
}