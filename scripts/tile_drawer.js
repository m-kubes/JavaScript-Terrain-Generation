export default class TileDrawer {
	constructor (ctx, tile_size, outline_width) {
		this.tile_size = tile_size
		this.ctx = ctx
		this.outline_width = outline_width
    }

	// get sort order
	// things with higher sort orders are rendered last (on top of everything else)
	static sort_order(tile, ignoreType=false) {
		const [x,y,z,t] = tile

		switch (t['type']) {
			case 'tree':
				// tree is 2 tiles tall, so get the average of the sorting order of the top and bottom part of the tree
				const bottom_tile_order = (x + z) + (0.5 * y)
				const top_tile_order = (x + z) + (0.5 * y + 1)
				return (bottom_tile_order + top_tile_order) / 2
		}

		return (x + z) + (0.5 * y)
	}

	// converts 3d coordinates to an isometric grid
	to_isometric(x, y, z, tile_size) {
		const iso_x = x * (0.5 * tile_size) + z * (-0.5 * tile_size)
		const iso_y = x * (0.25 * tile_size) + z * (0.25 * tile_size) - y * (0.5 * tile_size)
		return [iso_x, iso_y]
    }

	// rectange
	draw_rect(x, y, width, height) {
		this.ctx.beginPath()
		this.ctx.lineWidth = this.outline_width
		this.ctx.rect(x - 0.5 * width, y - 0.5 * height, width, height)
		this.ctx.fill()
		this.ctx.stroke()
    }

	// draws the top of a tile
	draw_top_tile_face(x, y, size) {
		this.ctx.beginPath()
		this.ctx.lineWidth = this.outline_width
		this.ctx.moveTo(x, y)
		this.ctx.lineTo(x + (0.5 * size), y - (0.25 * size))
		this.ctx.lineTo(x, y - (0.5 * size))
		this.ctx.lineTo(x - (0.5 * size), y - (0.25 * size))
		this.ctx.closePath()
		this.ctx.stroke()
		this.ctx.fill()
    }

	// draws the right or left side of a tile
	draw_side_tile_face(x, y, width, height, side=1) {
		this.ctx.beginPath()
		this.ctx.lineWidth = this.outline_width
		this.ctx.moveTo(x, y)
		this.ctx.lineTo(x - 0.5 * width * side, y - 0.25 * width)
		this.ctx.lineTo(x - 0.5 * width * side, y - 0.25 * width + 0.5 * height)
		this.ctx.lineTo(x, y + 0.5 * height)
		this.ctx.closePath()
		this.ctx.stroke()
		this.ctx.fill()
    }

	// tree leaves bro
	draw_tree_leaves(x, y, size) {
		this.ctx.beginPath()
		this.ctx.lineWidth = this.outline_width
		this.ctx.moveTo(x - 0.4 * size, y)
		this.ctx.lineTo(x + 0.4 * size, y)
		this.ctx.lineTo(x + 0.2 * size, y - 0.5 * size)
		this.ctx.lineTo(x + 0.325 * size, y - 0.5 * size)
		this.ctx.lineTo(x, y - 1.25 * size)
		this.ctx.lineTo(x - 0.325 * size, y - 0.5 * size)
		this.ctx.lineTo(x - 0.2 * size, y - 0.5 * size)
		this.ctx.lineTo(x - 0.4 * size, y)
		this.ctx.closePath()
		this.ctx.stroke()
		this.ctx.fill()
	}


	// all the math and color stuff needed to draw a tile
	// currently only accounts for tile types 'basic', 'grasstop', and 'tree'
	// this does fortunatly allow for modular tile colors so you can go into tile_colors.py and make whatever tile u want
	draw_tile(x,y,z,tile) {
		[x, y] = this.to_isometric(x,y,z,this.tile_size)

		switch (tile['type']) {
			case 'basic':
				// draw top face
				this.ctx.strokeStyle = tile['outline_color']
				this.ctx.fillStyle = tile['top_face_color']
				this.draw_top_tile_face(x, y, this.tile_size)

				// draw left side face
				this.ctx.fillStyle = tile['left_face_color']
				this.draw_side_tile_face(x, y, this.tile_size, this.tile_size, 1)

				// draw right side face
				this.ctx.fillStyle = tile['outline_color']
				this.draw_side_tile_face(x, y, this.tile_size, this.tile_size, -1)

				break
			case 'liquid':
				// draw top face
				this.ctx.strokeStyle = tile['outline_color']
				this.ctx.fillStyle = tile['top_face_color']
				this.draw_top_tile_face(x, y + 0.15 * this.tile_size, this.tile_size)

				// draw left side face
				this.ctx.fillStyle = tile['left_face_color']
				this.draw_side_tile_face(x, y + 0.15 * this.tile_size, this.tile_size, this.tile_size - 0.3 * this.tile_size, 1)

				// draw right side face
				this.ctx.fillStyle = tile['outline_color']
				this.draw_side_tile_face(x, y + 0.15 * this.tile_size, this.tile_size, this.tile_size - 0.3 * this.tile_size, -1)

				break
			case 'grasstop':
				// draw top face
				this.ctx.strokeStyle = tile['top_outline_color']
				this.ctx.fillStyle = tile['top_face_color']
				this.draw_top_tile_face(x, y, this.tile_size)

				// draw top left side face
				this.ctx.fillStyle = tile['top_face_color']
				this.draw_side_tile_face(x, y, this.tile_size, this.tile_size * 0.3, 1)

				// draw top right side face
				this.ctx.fillStyle = tile['top_outline_color']
				this.draw_side_tile_face(x, y, this.tile_size, this.tile_size * 0.3, -1)

				// draw bottom left face
				this.ctx.strokeStyle = tile['bottom_outline_color']
				this.ctx.fillStyle = tile['bottom_side_color']
				this.draw_side_tile_face(x, y + 0.15 * this.tile_size, this.tile_size, this.tile_size * 0.7, 1)

				// draw bottom right face
				this.ctx.fillStyle = tile['bottom_outline_color']
				this.draw_side_tile_face(x, y + 0.15 * this.tile_size, this.tile_size, this.tile_size * 0.7, -1)

				break
			case 'tree':
				// trunk
				this.ctx.strokeStyle = tile['trunk_outline_color']
				this.ctx.fillStyle = tile['trunk_color']
				this.draw_rect(x, y + 0.125 * this.tile_size, 0.25 * this.tile_size, 0.25 * this.tile_size)

				// part of trunk in shadow from the leaves
				this.ctx.strokeStyle = tile['trunk_shaded_outline_color']
				this.ctx.fillStyle = tile['trunk_shaded_color']
				this.draw_rect(x, y - 0.125 * this.tile_size, 0.25 * this.tile_size, 0.25 * this.tile_size)

				// leaves
				this.ctx.strokeStyle = tile['leaves_outline_color']
				this.ctx.fillStyle = tile['leaves_color']
				this.draw_tree_leaves(x, y - 0.125 * this.tile_size, this.tile_size)

				break
        }
    }
}