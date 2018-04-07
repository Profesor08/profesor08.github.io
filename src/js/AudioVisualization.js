import "pixi.js";
import PubSub from "pubsub-js";
import isMobile from "is-mobile";
import {TimelineMax} from "gsap";
import gradientColor from "gradient-color";


(function () {
  // windows width / height
  let width = $(window).width();
  let height = $(window).height();
  let isMobileDevice = isMobile();
  let mobileSizeMultiplier = 1;

  if (isMobileDevice === true)
  {
    mobileSizeMultiplier = 2;
    width *= mobileSizeMultiplier;
    height *= mobileSizeMultiplier;
    // radiusMultiplier = 0.5;
  }

  // Circles colors
  let colors = [
    "#e65100",
    "#ff8f00",
    "#fbc02d",
    "#eeff41",
    "#c6ff00",
    "#76ff03",
    "#1de9b6",
    "#00b0ff",
    "#3d5afe",
  ];

  let circles = [];
  let radiusMultiplier = 1;
  let bufferLength = 128;
  let audio = null;
  let analyser = null;
  let colorGradient = gradientColor(colors, bufferLength);//.map(color => new Color(color).rgbNumber());

  let canvas = document.createElement("canvas");
  canvas.classList.add("background");
  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext("2d");

  $(".main").append(canvas);

  for (let i = 0; i < bufferLength; i++)
  {
    let circle = {
      color: colorGradient[i],
      x: (width - 50) - i * ((width - 50) / bufferLength),
      y: Math.floor(Math.random() * height),
      direction: Math.random() < .5 ? -1 : 1,
      speed: (bufferLength - i) / 32 + Math.random() * 2,
      radius: (bufferLength - i) / 16,
      outerRadius: 0
    };

    circles.push(circle);

    if (isMobileDevice === true)
    {
      i += 3;
    }
  }

  function resizeScene(data)
  {
    if (isMobileDevice === true) {
      width = data.width * mobileSizeMultiplier;
      height = data.height * mobileSizeMultiplier;
    }
    else {
      width = data.width;
      height = data.height;
    }

    canvas.width = width;
    canvas.height = height;
  }

  function animate()
  {
    requestAnimationFrame(animate);

    // Resize canvas if window size  changes
    if (window.innerWidth !== width || window.innerHeight !== height)
    {
      resizeScene({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    // Draw circles
    if (analyser !== null)
    {


      let frequencyData = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(frequencyData);

      ctx.clearRect(0, 0, width, height);

      circles.forEach((circle, index) => {
        let offset = index;

        if (isMobileDevice === true)
        {
          offset *= 3;
        }

        circle.y = circle.y + circle.speed * circle.direction * .5 * mobileSizeMultiplier;

        if (circle.y < -circle.radius * 2)
        {
          circle.y = height + circle.radius * 2;
        }
        else if (circle.y > height + circle.radius * 2) {
          circle.y = -circle.radius * 2;
        }

        circle.x = (width - 50) - offset * ((width - 50) / bufferLength);
        circle.radius = frequencyData[offset] / 3 * radiusMultiplier;

        if (circle.outerRadius < circle.radius)
        {
          circle.outerRadius = circle.radius;
        }

        if (circle.radius > 0)
        {
          ctx.beginPath();
          ctx.lineWidth = 0;
          ctx.fillStyle = circle.color;
          ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }

        circle.outerRadius -= .5 * mobileSizeMultiplier;

        if (circle.outerRadius < 0) {
          circle.outerRadius = 0;
        }

        if (circle.outerRadius > 0) {

          ctx.beginPath();
          ctx.lineWidth = mobileSizeMultiplier;
          ctx.strokeStyle = circle.color;
          ctx.arc(circle.x, circle.y, circle.outerRadius, 0, 2 * Math.PI);
          ctx.stroke();
        }


      });
    }
  }

  resizeScene({
    width: window.innerWidth,
    height: window.innerHeight
  });

  animate();

  PubSub.subscribe("backgroundAudioReady", function (msg, data) {
    audio = data.audio;
    analyser = data.analyser;
  });

  // resize on window resize
  PubSub.subscribe("windowResize", function () {
    resizeScene({
      width: window.innerWidth,
      height: window.innerHeight
    });
  });

})();