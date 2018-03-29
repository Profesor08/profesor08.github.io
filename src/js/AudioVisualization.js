import "pixi.js";
import PubSub from "pubsub-js";
import isMobile from "is-mobile";
import Circle from "./Circle";
import {TimelineMax} from "gsap";

(function () {

  // Browser pixel floor fix. 0 - disabled
  let additionalWidth = 0;
  let additionalHeight = 0;

  // windows width / height
  let width = $(window).width() + additionalWidth;
  let height = $(window).height() + additionalHeight;

  // PIXI application
  const app = new PIXI.Application(width, height, {
    antialias: true,
    transparent: true
  });

  // PIXI Ticker
  const ticker = PIXI.ticker.shared;


  // PIXI containers
  let mainContainer = new PIXI.Container();

  // Circles colors
  let colors = [
    0xe65100,
    0xff8f00,
    0xfbc02d,
    0xeeff41,
    0xc6ff00,
    0x76ff03,
    0x1de9b6,
    0x00b0ff,
    0x3d5afe
  ];

  // Resize PIXI scene
  function resizeScene(data)
  {
    width = data.width + additionalWidth;
    height = data.height + additionalHeight;
    app.renderer.resize(width, height);
    app.renderer.render(mainContainer);
  }

  function map(n, start1, stop1, start2, stop2, withinBounds) {
    let newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
      return newval;
    }
    if (start2 < stop2) {
      return constrain(newval, start2, stop2);
    } else {
      return constrain(newval, stop2, start2);
    }
  }

  function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
  }

  let circlesContainer = new PIXI.Container();
  let circles = [];
  let radiusMultiplier = 1;
  let isMobileDevice = isMobile();
  let bufferLength = 64;
  let audio = null;
  let analyser = null;

  app.stage.addChild(mainContainer);

  app.view.classList.add("background");

  $(".main").append(app.view);

  mainContainer.addChild(circlesContainer);

  if (isMobileDevice === true)
  {
    radiusMultiplier = 0.5;
  }

  for (let i = 0; i < bufferLength; i++)
  {
    let circle = new Circle(circlesContainer);

    circle.setColor(colors[Math.floor(i / 8)]);

    circle.setPosition(
      (width - 50) - i * ((width - 50) / bufferLength),
      Math.floor(Math.random() * height)
    );

    circle.setDirection(Math.random() < .5 ? -1 : 1);

    circle.setSpeed((bufferLength - i) / 8 + Math.random() * 2);

    circle.setRadius((bufferLength - i) / 16);

    circles.push(circle);
  }

  ticker.add(function () {
    if (analyser !== null)
    {
      let frequencyData = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(frequencyData);

      circles.forEach((circle, index) => {
        circle.move(height);
        circle.setPositionX((width - 50) - index * ((width - 50) / bufferLength));
        circle.setRadius(frequencyData[index] / 3 * radiusMultiplier);
        circle.draw();
      });
    }
  });

  PubSub.subscribe("backgroundAudioTimeUpdate", function (msg, data) {

  });

  PubSub.subscribe("backgroundAudioReady", function (msg, data) {
    PubSub.publish("audioReadyMessageReceived");
    audio = data.audio;
    analyser = data.analyser;
  });

  // resize PIXI on window resize
  PubSub.subscribe("windowResize", function () {
    resizeScene({
      width: window.innerWidth,
      height: window.innerHeight
    });
  });

  resizeScene({
    width: window.innerWidth,
    height: window.innerHeight
  });

  ticker.add(function () {
    if (window.innerWidth !== width || window.innerHeight !== height)
    {
      resizeScene({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  });

})();