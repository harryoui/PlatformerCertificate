var Enemy = function()
{
	this.image = document.createElement("img");
	this.image.src = "villain.png";
	
	this.width = 80;
	this.height = 80
	
	this.position = new Vector2();
	this.velocity = new Vector2();
	
	this.position.set(1500, 195)
	
	this.direction = RIGHT;
}

Enemy.prototype.update = function(deltaTime)
{
	var acceleration = new Vector2();
	var enemyAccel = 4000;
	//COLLISIONS
	var collisionOffset = new Vector2();
	collisionOffset.set(-5, 20);
	var position = this.position.add(collisionOffset);
	
	var position = this.position.add(collisionOffset);
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	
	context.beginPath();
	context.rect(tx*TILE, ty*TILE, TILE,TILE);
	context.stroke();
	
	var nx = collisionPos.x % TILE;
	var ny = collisionPos.y % TILE;
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty);
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+1);

	if ( this.direction == RIGHT )
	{
		if ( !cell && (cell_right && nx) )
		{
			this.direction = LEFT;
		}
		
		if (cell_down && !cell_diag && mx)
		{
			this.direction = LEFT;
		}
	}
	else
	{
			if ( cell && (!cell_right && nx) )
			{
				this.direction = RIGHT;
			}
			if (!cell && (cell_diag && nx) )
			{
				this.direction = RIGHT;
			}
	}
	
}

Enemy.prototype.draw = function(offsetX, offsetY)
{
	context.drawImage(this.image, this.position.x - offsetX, this.position.y - offsetY, this.width, this.height);
}