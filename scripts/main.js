import TileDrawer from './tile_drawer.js';
import tiles from './tiles.json' with { type: "json" };
import canvas_bounds from './canvas_bounds.js';

const gen_form = document.getElementById('gen_form');
const generating_label = document.getElementById('generating_label');
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext("2d");


// make visible edges fatter
function make_edge(x, y, z, tile, grid_size, scene_tiles) {
    if (x == grid_size - 1 || z == grid_size - 1) {
        const edge_tile = tiles[tile['edge_tile']] ?? tile
        for (let i = 1; i < y; i++) {
            scene_tiles.push([x,y-i,z,edge_tile])
        }
    }
}


function generate_terrain(grid_size, biome_zoom, canvas_padding, height_variance, tree_chance, tile_thresholds) {
	const start_time = Date.now()
	console.log(`Starting generation... (Grid: ${grid_size}x${grid_size})`)

	// get tile size and line width based on grid size
	let tile_size
	let line_width
	for (let bound in canvas_bounds) {
		if (grid_size <= bound) {
			tile_size = canvas_bounds[bound][0]
			line_width = canvas_bounds[bound][1]
			break
		}
	}

	// instantiate stuff
	const drawer = new TileDrawer(ctx, tile_size, line_width)
	noise.seed(Math.random());

	// center and fit all tiles on screen
	canvas.width = grid_size * tile_size + (canvas_padding * 2)
	canvas.height = grid_size * tile_size + (canvas_padding * 2)
	ctx.translate((grid_size * tile_size * 0.5) + canvas_padding, (grid_size * tile_size * 0.25) + canvas_padding)

	// create list of tiles
	const scene_tiles = []
	for (let x = 0; x < grid_size; x++) {
		for (let z = 0; z < grid_size; z++) {
			// get noise values and make them between 0 and 1
			const biome_noise_value = (noise.perlin2(x/(grid_size / biome_zoom), z/(grid_size / biome_zoom)) + 1) / 2
			const forest_noise_value = (noise.perlin2(x/(grid_size / biome_zoom), z/(grid_size / biome_zoom) + 50) + 1) / 2

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

			make_edge(x, y, z, tile, grid_size, scene_tiles)
			scene_tiles.push([x,y,z,tile])
		}
	}

	// sort tiles by their sorting order and log it
	const sorted_tiles = scene_tiles.sort((a, b) => TileDrawer.sort_order(b) < TileDrawer.sort_order(a) ? 1 : -1)
	const done_sorting_time = Date.now()
	console.log(`Finished generating and sorting in ${(done_sorting_time - start_time) / 1000} seconds`)

	// draw everything
	for (let tile of sorted_tiles) {
		drawer.draw_tile(tile[0],tile[1],tile[2],tile[3])
	}

	console.log(`Finished drawing in ${(Date.now() - done_sorting_time) / 1000} seconds`)
	console.log(`Total generation time: ${(Date.now() - start_time) / 1000} seconds`)
}


const grid_size = 150
const biome_zoom = 6
const canvas_padding = 5
const height_variance = 9
const tree_chance = 0.45

const tile_thresholds = {
	'peak': 0.7,
	'mountain': 0.645,
	'plains': 0.44,
	'beach': 0.4
}

gen_form.addEventListener('submit', (event) => {
	event.preventDefault()
	generating_label.style.display = 'block'
	ctx.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2)

	// put this in the next event loop so it updates before
	setTimeout(() => {
		generate_terrain(grid_size, biome_zoom, canvas_padding, height_variance, tree_chance, tile_thresholds)	
		generating_label.style.display = 'none'
	}, 0);
})