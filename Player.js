var LEFT = 0;
var RIGHT = 1;
var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_SHOOT_LEFT = 3;
var ANIM_CLIMB = 4;
var ANIM_IDLE_RIGHT = 5;
var ANIM_JUMP_RIGHT = 6;
var ANIM_WALK_RIGHT = 7;
var ANIM_SHOOT_RIGHT = 8;
var ANIM_MAX = 9;

var Player = function()
{
	//load up sprite instead of image
	this.sprite = new Sprite("ChuckNorris.png");
	
	//set up all the animations
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[0, 1, 2, 3, 4, 5, 6, 7]); //LEFT IDLE ANIMATION
		
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[8, 9, 10, 11, 12]); //LEFT JUMP ANIMATION
		
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);//LEFT WALK ANIMATION
		
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[52, 53, 54, 55, 56, 57, 58, 59]); //RIGHT IDLE ANIMATION
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[60, 61, 62, 63, 64]); //RIGHT JUMP ANIMATION
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]); //RIGHT WALK ANIMATION
	
	//this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	//[42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]); //CLIMB ANIMATION
	
	this.health = 3;
	
	//set width and height to be the correct size of the image file
	this.width = 165;
	this.height = 125;
	for ( var i = 0 ; i < ANIM_MAX ; ++i)
	{
		this.sprite.setAnimationOffset(i, -this.width/2, -this.height/2);
	}
	
	this.startPos = new Vector2();
	this.startPos.set(250, 450);
	
	this.position = new Vector2();
	this.position.set(this.startPos.x, this.startPos.y);
	

	
	this.velocity = new Vector2() ;
	
	this.hurtTimer = 0;
	
	this.jumping = false;
	this.falling = false;
	
	this.direction = RIGHT;
	
	this.angularVelocity = 0;
	this.rotation = 0;
};

Player.prototype.changeDirectionalAnimation = function(leftAnim, rightAnim)
{
	if ( this.direction == LEFT)
	{
		if ( this.sprite.currentAnimation != leftAnim )
		{
			this.sprite.setAnimation( leftAnim );
		}
	}
	else if ( this.direction == RIGHT )
	{
		if ( this.sprite.currentAnimation != rightAnim )
		{
			this.sprite.setAnimation(rightAnim);
		}
	}
}
	
Player.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	
	var acceleration = new Vector2();
	var playerAccel = 6000;
	var playerDrag = 12;
	var playerGravity = TILE * 9.8 * 7;
	var jumpForce = 45000;
	
	acceleration.y = playerGravity;
	
	if ( keyboard.isKeyDown(keyboard.KEY_LEFT) )
	{
		acceleration.x -= playerAccel;
		//this.image.src = "heroFlip.png";
		this.direction = LEFT;
	}
	if ( keyboard.isKeyDown(keyboard.KEY_RIGHT) )
	{
		acceleration.x += playerAccel;
		//this.image.src = "hero.png";
		this.direction = RIGHT;
	}
	
	if ( this.velocity.y > 0)
	{
		this.falling = true;
	}
	else
	{
		this.falling = false;
	}
	
	if ( keyboard.isKeyDown(keyboard.KEY_UP) && !this.jumping && !this.falling)
	{
		acceleration.y -= jumpForce;
		 this.jumping = true;
		
	}
	
	var dragVector = this.velocity.multiplyScalar(playerDrag);
	dragVector.y = 0;
	acceleration = acceleration.subtract(dragVector);
	
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	
	//DO ANIMATION LOGIC
	if ( this.jumping || this.falling )
	{
		this.changeDirectionalAnimation(ANIM_JUMP_LEFT, ANIM_JUMP_RIGHT);
	}
	else
	{
		if ( Math.abs(this.velocity.x) > 25)
		{
			this.changeDirectionalAnimation(ANIM_WALK_LEFT, ANIM_WALK_RIGHT);
		}
		else
		{
			this.changeDirectionalAnimation(ANIM_IDLE_LEFT, ANIM_IDLE_RIGHT);
		}
	}
	
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
	
	
	var deathcell = cellAtTileCoord(LAYER_DEATH, tx, ty);
	var deathcell_right = cellAtTileCoord(LAYER_DEATH, tx+1, ty);
	var deathcell_down  = cellAtTileCoord(LAYER_DEATH, tx, ty+1);
	var deathcell_diag  = cellAtTileCoord(LAYER_DEATH, tx+1, ty+1);
	
	var laddercell = cellAtTileCoord(LAYER_LADDER, tx, ty);
	var laddercell_right = cellAtTileCoord(LAYER_LADDER, tx+1, ty);
	var laddercell_down  = cellAtTileCoord(LAYER_LADDER, tx, ty+1);
	var laddercell_diag  = cellAtTileCoord(LAYER_LADDER, tx+1, ty+1);
	
		if ( laddercell || 
		(laddercell_right && nx ) ||
		(laddercell_down && ny ) ||
		(laddercell_diag && nx && ny))
		{
			if (keyboard.isKeyDown(keyboard.KEY_UP))
			{
				playerDrag = 0;
				playerGravity = TILE * 9.8 * 0;
				jumpForce = 0;
				player.velocity.y =(player.velocity.y-=50);
			}
		}
		else
		{
			//playerDrag = 12;
			//playerGravity = TILE * 9.8 * 7;
			//jumpForce = 45000;
		}
	
	if ( deathcell || 
		(deathcell_right && nx ) ||
		(deathcell_down && ny ) ||
		(deathcell_diag && nx && ny))
	{
		if (this.hurtTimer <= 0 )
		{
			this.health -= 1;
			this.hurtTimer = 2;
			this.velocity.set(-500, -500);
		}
	}
	
	this.hurtTimer -= deltaTime;
	
	
	
	//ACTUAL COLLISION!
	if ( this.velocity.y > 0 ) //if moving down
	{
		if ( (cell_down && !cell) || (cell_diag && !cell_right && nx) )
		{
			this.position.y = tileToPixel(ty) - collisionOffset.y;
			this.velocity.y = 0;
			ny = 0;
			this.jumping = false;
		}
	}
	else if ( this.velocity.y < 0 ) //if moving up
	{
		if ( ( cell && !cell_down) || (cell_right && !cell_diag && nx) )
		{
			this.position.y = tileToPixel(ty + 1) - collisionOffset.y;
			this.velocity.y = 0;
			
			cell = cell_down;
			cell_right = cell_diag;
			cell_down = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+2);
			cell_diag = cellAtTileCoord(LAYER_PLATFORMS, tx+1, ty+2);
			ny = 0;
		}
	}
	
	if (this.velocity.x > 0 ) //if we're moving right
	{
		if ( ( cell_right && !cell) || (cell_diag && !cell_down && ny) )
		{
			this.position.x = tileToPixel(tx) - collisionOffset.x;
			this.velocity.x = 0;
		}
	}
	else if (this.velocity.x < 0) //if we're moving left
	{
		if ( ( cell && !cell_right) || (cell_down && !cell_diag && ny) )
		{
			this.position.x = tileToPixel(tx+1) - collisionOffset.x;
			this.velocity.x = 0;
		}
	}
}

Player.prototype.draw = function(offsetX, offsetY)
{
	if ( this.hurtTimer <= 0 || (this.hurtTimer*4 - Math.floor(this.hurtTimer*4)) > 0.5)
	{
		this.sprite.draw(context, this.position.x - offsetX, this.position.y - offsetY);
	}
	context.fillStyle = "black";
	context.font = "28px Arial";
	var textToDisplay = "HP: " + this.health;
	//context.fillText(textToDisplay, canvas.width-1200, 50);
}