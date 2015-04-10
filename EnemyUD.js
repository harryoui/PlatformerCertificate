var Enemy = function()
{
	this.image = document.createElement("img");
	this.image.src = "villain.png";
	
	this.width = 80;
	this.height = 80
	
	this.position = new Vector2();
	this.velocity = new Vector2();
	
	this.position.set(150, 200)
	
	this.direction = UP;
}

Enemy.prototype.update = function(deltaTime)
{
	var acceleration = new Vector2();
	var enemyAccel = 4000;
	var enemyDrag = 10;
	
	
	
	
	
	
	
	
	
	//COLLISIONS
	var collisionOffset = new Vector2();
	collisionOffset.set(-25, 24);
	var collisionPos = this.position.add(collisionOffset);
	
	var collisionPos = this.position.add(collisionOffset);
	
	var tx = pixelToTile(collisionPos.x);
	var ty = pixelToTile(collisionPos.y);
	
	var nx = collisionPos.x % TILE;
	var ny = collisionPos.y % TILE;
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty);
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+1);
	
	if ( this.velocity.y > 0 ) //if moving down
	{
		if ( (cell_down && !cell) || (cell_diag && !cell_right && nx) )
		{
			this.position.y = tileToPixel(ty) - collisionOffset.y;
			this.direction = UP;
			ny = 0;
		}
	}
	else if ( this.velocity.y < 0 ) //if moving up
	{
		if ( ( cell && !cell_down) || (cell_right && !cell_diag && nx) )
		{
			this.position.y = tileToPixel(ty + 1) - collisionOffset.y;
			this.direction = DOWN;
			
			cell = cell_down;
			cell_right = cell_diag;
			cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+2);
			cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+2);
			ny = 0;
		}
	}

	
	
	
	
	
	
	
	
	
	
	
	if ( this.direction == UP)
	{
		acceleration.y = enemyAccel;
	}
	else
	{
		acceleration.y = -enemyAccel;
	}
	
	var dragX = this.velocity.x * enemyDrag;
	acceleration.x -= dragX
	
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
}

Enemy.prototype.draw = function(offsetX, offsetY)
{
	context.drawImage(this.image, this.position.x - offsetX, this.position.y - offsetY, this.width, this.height);
}