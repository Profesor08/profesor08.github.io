export default class Circle
{

  constructor(container, color)
  {
    this.inner = new PIXI.Graphics();
    this.outer = new PIXI.Graphics();
    container.addChild(this.inner);
    container.addChild(this.outer);
    this.color = color;
    this.direction = 0;
    this.speed = 0;
    this.x = 0;
    this.y = 0;
    this.radius = 0;
    this.innerRadius = 0;
    this.outerRadius = 0;
  }

  setDirection(direction)
  {
    this.direction = direction;
  }

  setSpeed(speed)
  {
    this.speed = speed;
  }

  setPosition(x, y)
  {
    this.x = x;
    this.y = y;
  }

  setPositionX(x)
  {
    this.x = x;
  }

  setPositionY(y)
  {
    this.y = y;
  }

  getPosition()
  {
    return {
      x: this.x,
      y: this.y
    }
  }

  getPositionX()
  {
    return this.x;
  }

  getPositionY()
  {
    return this.y;
  }

  setColor(color)
  {
    this.color = color;
  }

  setRadius(radius)
  {
    this.radius = radius;

    this.innerRadius = this.radius;

    if (this.outerRadius < this.radius)
    {
      this.outerRadius = this.radius;
    }
  }

  getRadius()
  {
    return this.radius;
  }

  changeDirection()
  {
    this.direction *= -1;
  }

  updateRadius()
  {
    this.outerRadius -= .5;

    if (this.outerRadius < 0) {
      this.outerRadius = 0;
    }
  }

  move(height)
  {
    this.y = this.y + this.speed * this.direction * .5;

    if (this.y < -this.radius * 2)
    {
      this.y = height + this.radius * 2;
    }
    else if (this.y > height + this.radius * 2) {
      this.y = -this.radius * 2;
    }
  }

  draw()
  {

    this.updateRadius();

    this.inner.alpha = 0.7;
    this.inner.clear();
    this.inner.beginFill(this.color);
    this.inner.lineStyle(0);
    this.inner.position.x = this.x;
    this.inner.position.y = this.y;
    this.inner.drawCircle(0, 0, this.innerRadius);
    this.inner.endFill();

    this.outer.alpha = 0.3;
    this.outer.clear();
    this.outer.lineStyle(1, this.color);
    this.outer.position.x = this.x;
    this.outer.position.y = this.y;
    this.outer.drawCircle(0, 0, this.outerRadius);
    this.outer.endFill();
  }
}