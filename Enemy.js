var Enemy = function()
{
	this.image = document.createElement("img");

	this.position = new Vector2();
	this.position.set(canvas.width/2, canvas.height/2);
	
	this.velocity = new Vector2() ;
	
	this.width = 159;
	this.height = 163;
	
	this.angularVelocity = 0;
	this.rotation = 0;
	this.image.src = "villain.png";
};

Enemy.prototype.update = function(deltaTime)
{
	var acceleration = new Vector2();
	var enemyAccel = 5000;
	var enemyDrag = 11;
	var enemyGravity = TILE * 9.8 * 0;
	
	acceleration.y = enemyGravity;
	

	//acceleration = acceleration.subtract(this.velocity.multiplyScalar(enemyDrag)
	
	this.velocity = this.velocity.add(acceleration.multiplyScalar(deltaTime));
	this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
	
}

Enemy.prototype.draw = function()
{
	context.save();
	
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width / 2, -this.height /2);
	
	context.restore();
}