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
	var enemyAccel = 4000; //[]how do I make this have also a vertical movement?
	var enemyDrag = 10;		//[]how do I make multiple of these enemies with either up/down or left/right movement?
							//[]how do I make multiple of these enemies with different spawn points in selected locations?
							//stop weird lines on screen and weird 'tears'?
							//[]how to get spike ball to collide with player and respawn
							//[]how to get spike ball destroyed by player bullets
							//how to set player gravity, drag and jump to zero in section
	
	//COLLISIONS
	var collisionOffset = new Vector2();
	collisionOffset.set(20, 20);
	var position = this.position.add(collisionOffset);
	
	var position = this.position.add(collisionOffset);
	
	var tx = pixelToTile(position.x);
	var ty = pixelToTile(position.y);
	
	var nx = position.x % TILE;
	var ny = position.y % TILE;
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cell_right = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty);
	var cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
	var cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+1);
	
	if (this.velocity.x > 0 ) //if we're moving right
	{
		if ( ( cell_right && !cell) || (cell_diag && !cell_down && ny) )
		{
			this.position.x = tileToPixel(tx) - collisionOffset.x;
			this.direction = LEFT;
		}
	}
	
	
	
	else if (this.velocity.x < 0) //if we're moving left
	{
		if ( ( cell && !cell_right) || (cell_down && !cell_diag && ny) )
		{
			this.position.x = tileToPixel(tx+1) - collisionOffset.x;
			this.direction = RIGHT;
		}
	}
	
	
	
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
	
	if ( this.direction == RIGHT)
	{
		acceleration.x = enemyAccel;
	}
	else if ( this.direction == LEFT)
	{
		acceleration.x = -enemyAccel;
	}
	else if ( this.direction == UP)
	{
		acceleration.y = enemyAccel
	}
	else if ( this.direction == DOWN)
	{
		acceleration.y = -enemyAccel
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