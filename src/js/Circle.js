export default class Circle
{

  constructor(container, color)
  {
    this.inner = new PIXI.Graphics();
    container.addChild(this.inner);
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
    if (this.outerRadius > this.innerRadius)
    {
      this.outerRadius -= .01;
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
    this.inner.clear();
    this.inner.beginFill(this.color);
    this.inner.lineStyle(0);
    this.inner.position.x = this.x;
    this.inner.position.y = this.y;
    this.inner.drawCircle(0, 0, this.innerRadius);
    this.inner.endFill();
  }
}