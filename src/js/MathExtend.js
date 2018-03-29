(function () {

  /**
   * Constrains a value between a minimum and maximum value.
   *
   * @method constrain
   * @param  {Number} n    number to constrain
   * @param  {Number} low  minimum limit
   * @param  {Number} high maximum limit
   * @return {Number}      constrained number
   * @example
   * <div><code>
   * function draw() {
   *   background(200);
   *
   *   var leftWall = 25;
   *   var rightWall = 75;
   *
   *   // xm is just the mouseX, while
   *   // xc is the mouseX, but constrained
   *   // between the leftWall and rightWall!
   *   var xm = mouseX;
   *   var xc = constrain(mouseX, leftWall, rightWall);
   *
   *   // Draw the walls.
   *   stroke(150);
   *   line(leftWall, 0, leftWall, height);
   *   line(rightWall, 0, rightWall, height);
   *
   *   // Draw xm and xc as circles.
   *   noStroke();
   *   fill(150);
   *   ellipse(xm, 33, 9, 9); // Not Constrained
   *   fill(0);
   *   ellipse(xc, 66, 9, 9); // Constrained
   * }
   * </code></div>
   *
   * @alt
   * 2 vertical lines. 2 ellipses move with mouse X 1 does not move passed lines
   *
   */
  Math.constrain = function(n, low, high) {
    return Math.max(Math.min(n, high), low);
  };

  /**
   * Calculates the distance between two points.
   *
   * @method dist
   * @param  {Number} x1 x-coordinate of the first point
   * @param  {Number} y1 y-coordinate of the first point
   * @param  {Number} x2 x-coordinate of the second point
   * @param  {Number} y2 y-coordinate of the second point
   * @return {Number}    distance between the two points
   *
   * @example
   * <div><code>
   * // Move your mouse inside the canvas to see the
   * // change in distance between two points!
   * function draw() {
   *   background(200);
   *   fill(0);
   *
   *   var x1 = 10;
   *   var y1 = 90;
   *   var x2 = mouseX;
   *   var y2 = mouseY;
   *
   *   line(x1, y1, x2, y2);
   *   ellipse(x1, y1, 7, 7);
   *   ellipse(x2, y2, 7, 7);
   *
   *   // d is the length of the line
   *   // the distance from point 1 to point 2.
   *   var d = int(dist(x1, y1, x2, y2));
   *
   *   // Let's write d along the line we are drawing!
   *   push();
   *   translate((x1 + x2) / 2, (y1 + y2) / 2);
   *   rotate(atan2(y2 - y1, x2 - x1));
   *   text(nfc(d, 1), 0, -5);
   *   pop();
   *   // Fancy!
   * }
   * </code></div>
   *
   * @alt
   * 2 ellipses joined by line. 1 ellipse moves with mouse X&Y. Distance displayed.
   */
  /**
   * @method dist
   * @param  {Number} x1
   * @param  {Number} y1
   * @param  {Number} z1 z-coordinate of the first point
   * @param  {Number} x2
   * @param  {Number} y2
   * @param  {Number} z2 z-coordinate of the second point
   * @return {Number}    distance between the two points
   */
  Math.dist = function() {
    if (arguments.length === 4) {
      //2D
      return this.hypot(arguments[2] - arguments[0], arguments[3] - arguments[1]);
    } else if (arguments.length === 6) {
      //3D
      return this.hypot(
        arguments[3] - arguments[0],
        arguments[4] - arguments[1],
        arguments[5] - arguments[2]
      );
    }
  };

  /**
   * Calculates a number between two numbers at a specific increment. The amt
   * parameter is the amount to interpolate between the two values where 0.0
   * equal to the first point, 0.1 is very near the first point, 0.5 is
   * half-way in between, etc. The lerp function is convenient for creating
   * motion along a straight path and for drawing dotted lines.
   *
   * @method lerp
   * @param  {Number} start first value
   * @param  {Number} stop  second value
   * @param  {Number} amt   number between 0.0 and 1.0
   * @return {Number}       lerped value
   * @example
   * <div><code>
   * function setup() {
   *   background(200);
   *   var a = 20;
   *   var b = 80;
   *   var c = lerp(a, b, 0.2);
   *   var d = lerp(a, b, 0.5);
   *   var e = lerp(a, b, 0.8);
   *
   *   var y = 50;
   *
   *   strokeWeight(5);
   *   stroke(0); // Draw the original points in black
   *   point(a, y);
   *   point(b, y);
   *
   *   stroke(100); // Draw the lerp points in gray
   *   point(c, y);
   *   point(d, y);
   *   point(e, y);
   * }
   * </code></div>
   *
   * @alt
   * 5 points horizontally staggered mid-canvas. mid 3 are grey, outer black
   *
   */
  Math.lerp = function(start, stop, amt) {
    return amt * (stop - start) + start;
  };

  /**
   * Calculates the magnitude (or length) of a vector. A vector is a direction
   * in space commonly used in computer graphics and linear algebra. Because it
   * has no "start" position, the magnitude of a vector can be thought of as
   * the distance from the coordinate 0,0 to its x,y value. Therefore, mag() is
   * a shortcut for writing dist(0, 0, x, y).
   *
   * @method mag
   * @param  {Number} x first value
   * @param  {Number} y second value
   * @return {Number}   magnitude of vector from (0,0) to (a,b)
   * @example
   * <div><code>
   * function setup() {
   *   var x1 = 20;
   *   var x2 = 80;
   *   var y1 = 30;
   *   var y2 = 70;
   *
   *   line(0, 0, x1, y1);
   *   print(mag(x1, y1)); // Prints "36.05551275463989"
   *   line(0, 0, x2, y1);
   *   print(mag(x2, y1)); // Prints "85.44003745317531"
   *   line(0, 0, x1, y2);
   *   print(mag(x1, y2)); // Prints "72.80109889280519"
   *   line(0, 0, x2, y2);
   *   print(mag(x2, y2)); // Prints "106.3014581273465"
   * }
   * </code></div>
   *
   * @alt
   * 4 lines of different length radiate from top left of canvas.
   *
   */
  Math.mag = function(x, y) {
    return this.hypot(x, y);
  };

  /**
   * Re-maps a number from one range to another.
   * <br><br>
   * In the first example above, the number 25 is converted from a value in the
   * range of 0 to 100 into a value that ranges from the left edge of the
   * window (0) to the right edge (width).
   *
   * @method map
   * @param  {Number} value  the incoming value to be converted
   * @param  {Number} start1 lower bound of the value's current range
   * @param  {Number} stop1  upper bound of the value's current range
   * @param  {Number} start2 lower bound of the value's target range
   * @param  {Number} stop2  upper bound of the value's target range
   * @param  {Boolean} [withinBounds] constrain the value to the newly mapped range
   * @return {Number}        remapped number
   * @example
   *   <div><code>
   * var value = 25;
   * var m = map(value, 0, 100, 0, width);
   * ellipse(m, 50, 10, 10);
   </code></div>
   *
   *   <div><code>
   * function setup() {
   *   noStroke();
   * }
   *
   * function draw() {
   *   background(204);
   *   var x1 = map(mouseX, 0, width, 25, 75);
   *   ellipse(x1, 25, 25, 25);
   *   //This ellipse is constrained to the 0-100 range
   *   //after setting withinBounds to true
   *   var x2 = map(mouseX, 0, width, 0, 100, true);
   *   ellipse(x2, 75, 25, 25);
   * }
   </code></div>
   *
   * @alt
   * 10 by 10 white ellipse with in mid left canvas
   * 2 25 by 25 white ellipses move with mouse x. Bottom has more range from X
   *
   */
  Math.map = function (value, start1, stop1, start2, stop2, withinBounds) {
    let newValue = (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds)
    {
      return newValue;
    }
    if (start2 < stop2)
    {
      return this.constrain(newValue, start2, stop2);
    }
    else
    {
      return this.constrain(newValue, stop2, start2);
    }
  };

  /**
   * Normalizes a number from another range into a value between 0 and 1.
   * Identical to map(value, low, high, 0, 1).
   * Numbers outside of the range are not clamped to 0 and 1, because
   * out-of-range values are often intentional and useful. (See the second
   * example above.)
   *
   * @method norm
   * @param  {Number} value incoming value to be normalized
   * @param  {Number} start lower bound of the value's current range
   * @param  {Number} stop  upper bound of the value's current range
   * @return {Number}       normalized number
   * @example
   * <div><code>
   * function draw() {
   *   background(200);
   *   var currentNum = mouseX;
   *   var lowerBound = 0;
   *   var upperBound = width; //100;
   *   var normalized = norm(currentNum, lowerBound, upperBound);
   *   var lineY = 70;
   *   line(0, lineY, width, lineY);
   *   //Draw an ellipse mapped to the non-normalized value.
   *   noStroke();
   *   fill(50);
   *   var s = 7; // ellipse size
   *   ellipse(currentNum, lineY, s, s);
   *
   *   // Draw the guide
   *   var guideY = lineY + 15;
   *   text('0', 0, guideY);
   *   textAlign(RIGHT);
   *   text('100', width, guideY);
   *
   *   // Draw the normalized value
   *   textAlign(LEFT);
   *   fill(0);
   *   textSize(32);
   *   var normalY = 40;
   *   var normalX = 20;
   *   text(normalized, normalX, normalY);
   * }
   * </code></div>
   *
   * @alt
   * ellipse moves with mouse. 0 shown left & 100 right and updating values center
   *
   */
  Math.norm = function (value, start, stop) {
    return this.map(value, start, stop, 0, 1);
  };

  /**
   * Squares a number (multiplies a number by itself). The result is always a
   * positive number, as multiplying two negative numbers always yields a
   * positive result. For example, -1 * -1 = 1.
   *
   * @method sq
   * @param  {Number} n number to square
   * @return {Number}   squared number
   * @example
   * <div><code>
   * function draw() {
   *   background(200);
   *   var eSize = 7;
   *   var x1 = map(mouseX, 0, width, 0, 10);
   *   var y1 = 80;
   *   var x2 = sq(x1);
   *   var y2 = 20;
   *
   *   // Draw the non-squared.
   *   line(0, y1, width, y1);
   *   ellipse(x1, y1, eSize, eSize);
   *
   *   // Draw the squared.
   *   line(0, y2, width, y2);
   *   ellipse(x2, y2, eSize, eSize);
   *
   *   // Draw dividing line.
   *   stroke(100);
   *   line(0, height / 2, width, height / 2);
   *
   *   // Draw text.
   *   var spacing = 15;
   *   noStroke();
   *   fill(0);
   *   text('x = ' + x1, 0, y1 + spacing);
   *   text('sq(x) = ' + x2, 0, y2 + spacing);
   * }
   * </code></div>
   *
   * @alt
   * horizontal center line squared values displayed on top and regular on bottom.
   *
   */
  Math.sq = function (n) {
    return n * n;
  };

  if (typeof Math.hypot !== 'function')
  {
    // Calculate the length of the hypotenuse of a right triangle
    // This won't under- or overflow in intermediate steps
    // https://en.wikipedia.org/wiki/Hypot
    Math.hypot = function hypot(x, y, z) {
      // Use the native implementation if it's available
      if (typeof Math.hypot === 'function')
      {
        return Math.hypot.apply(null, arguments);
      }

      // Otherwise use the V8 implementation
      // https://github.com/v8/v8/blob/8cd3cf297287e581a49e487067f5cbd991b27123/src/js/math.js#L217
      let length = arguments.length;
      let args = [];
      let max = 0;
      for (let i = 0; i < length; i++)
      {
        let n = arguments[i];
        n = +n;
        if (n === Infinity || n === -Infinity)
        {
          return Infinity;
        }
        n = Math.abs(n);
        if (n > max)
        {
          max = n;
        }
        args[i] = n;
      }

      if (max === 0)
      {
        max = 1;
      }
      let sum = 0;
      let compensation = 0;
      for (let j = 0; j < length; j++)
      {
        let m = args[j] / max;
        let summand = m * m - compensation;
        let preliminary = sum + summand;
        compensation = preliminary - sum - summand;
        sum = preliminary;
      }
      return Math.sqrt(sum) * max;
    }
  }

})();