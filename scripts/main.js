import TileDrawer from './tile_drawer.js';
import tiles from './tiles.json' with { type: "json" };

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext("2d");

const tile_size = 20
const line_width = 1
const width = 500
const height = 500
const biome_zoom = 6
const canvas_padding = 5
const height_variance = 9
const tree_chance = 0.45

// instantiate stuff
const drawer = new TileDrawer(ctx, tile_size, line_width)
noise.seed(Math.random());

// center all tiles on screen
canvas.width = width * tile_size + (canvas_padding * 2)
canvas.height = height * tile_size + (canvas_padding * 2)
ctx.translate((width * tile_size * 0.5) + canvas_padding, (height * tile_size * 0.25) + canvas_padding)

// places this tile if GREATER THAN the float
// water always places below the lowest threshold
const tile_thresholds = {
	'peak': 0.7,
	'mountain': 0.645,
	'plains': 0.44,
	'beach': 0.4
}


// make visible edges fatter
function make_edge(x, y, z, tile) {
    if (x == width - 1 || z == height - 1) {
        const edge_tile = tiles[tile['edge_tile']] ?? tile
        for (let i = 1; i < y; i++) {
            scene_tiles.push([x,y-i,z,edge_tile])
        }
    }
}


// create list of tiles
const scene_tiles = []
for (let x = 0; x < height; x++) {
	for (let z = 0; z < width; z++) {
		// get noise values and make them between 0 and 1
		const biome_noise_value = (noise.perlin2(x/(width / biome_zoom), z/(height / biome_zoom)) + 1) / 2
		const forest_noise_value = (noise.perlin2(x/(width / biome_zoom), z/(height / biome_zoom) + 50) + 1) / 2

		// get y value of tile from noise
		// this also centers the terrain on the screen
		let y = Math.max(Math.floor(biome_noise_value * height_variance), 3)

		// get type of tile from noise values
		// also tweaks y values to make mountains a little taller
		let tile
		if (biome_noise_value > tile_thresholds['peak']) {
			tile = tiles['dark_stone']
			y += 2
			scene_tiles.push([x,y-1,z,tile])
			scene_tiles.push([x,y-2,z,tile])

        } else if (biome_noise_value > tile_thresholds['mountain']) {
			tile = tiles['stone']
			y += 1
			scene_tiles.push([x,y-1,z,tile])

        } else if (biome_noise_value > tile_thresholds['plains']) {
			tile = tiles['grass']

			// place trees in forests
			if (forest_noise_value < 0.5 && Math.random() < tree_chance) {
				scene_tiles.push([x,y+1,z,tiles['tree']])
            }

			// account for water gap when going from grass straight to water
			if (biome_noise_value > 0.46) {
				scene_tiles.push([x,y-1,z,tiles['dirt']])
            }

        } else if (biome_noise_value > tile_thresholds['beach']) {
			tile = tiles['sand']
        } else {
			tile = tiles['water']
        }

		make_edge(x,y,z,tile)
		scene_tiles.push([x,y,z,tile])
    }
}

// makes sure sorting orders are correct
const sorted_tiles = scene_tiles.sort((a, b) => TileDrawer.sort_order(b) < TileDrawer.sort_order(a) ? 1 : -1)

for (let tile of sorted_tiles) {
	drawer.draw_tile(tile[0],tile[1],tile[2],tile[3])
}
