import "jquery-mousewheel";
import "pixi.js";
import {TimelineMax, Power3} from "gsap";
import Perlin from "./Perlin";
import PubSub from "pubsub-js";
import isMobile from "is-mobile";

(function () {

  // Browser pixel floor fix. 0 - disabled
  let additionalWidth = 0;
  let additionalHeight = 0;

  // windows width / height
  let width = $(window).width() + additionalWidth;
  let height = $(window).height() + additionalHeight;
  let activeImageId = "home";
  let perlinOffset = 0;

  // background textures
  let textures = [
    {
      name: "home",
      texture: require("../images/bg/1.jpg")
    },
    {
      name: "works",
      texture: require("../images/bg/2.jpg")
    },
    {
      name: "contact",
      texture: require("../images/bg/3.jpg")
    },
    // {
    //   name: "unused",
    //   texture: require("../images/bg/3.jpg")
    // }
  ];

  // PIXI application
  const app = new PIXI.Application(width, height, {antialias: true});

  // PIXI loader for loading textures
  const loader = PIXI.loader;

  // PIXI Ticker
  const ticker = PIXI.ticker.shared;

  // PIXI containers
  let mainContainer = new PIXI.Container();
  let currentImageContainer = new PIXI.Container();
  let nextImageContainer = new PIXI.Container();

  // PIXI Textures
  let activeImage = null;
  let nextImage = null;

  // PIXI masks
  let activeImageMask = new PIXI.Graphics();
  let nextImageMask = new PIXI.Graphics();

  // PIXI Blue Filters
  let nextImageBlurFilter = new PIXI.filters.BlurFilter();
  let activeImageBlurFilter = new PIXI.filters.BlurFilter();

  // Resize scene

  function resizeScene(data)
  {
    width = data.width + additionalWidth;
    height = data.height + additionalHeight;

    imageCover(activeImage, width, height);
    imageCover(nextImage, width, height);

    activeImageMask.moveTo(0, 0);
    activeImageMask.lineTo(0, height);
    activeImageMask.lineTo(width, height);
    activeImageMask.lineTo(width, 0);

    nextImageMask.moveTo(0, height);
    nextImageMask.lineTo(0, height);
    nextImageMask.lineTo(width, height);
    nextImageMask.lineTo(width, height);

    app.renderer.resize(width, height);
    app.renderer.render(mainContainer);
  }

  // Set background image size cover and centered
  function imageCover(image)
  {
    let windowAspectRatio = app.screen.width / app.screen.height;
    let imageAspectRatio = image.width / image.height;

    image.anchor.set(0.5);
    image.x = app.screen.width / 2 + additionalWidth / 2;
    image.y = app.screen.height / 2;

    if (windowAspectRatio > imageAspectRatio)
    {
      image.width = app.screen.width;
      image.height = app.screen.width / imageAspectRatio;
    }
    else
    {
      image.width = app.screen.height * imageAspectRatio;
      image.height = app.screen.height;
    }
  }

  function scaleImage(image, x, y, direction)
  {
    let windowAspectRatio = app.screen.width / app.screen.height;
    let imageAspectRatio = (image.width + x) / (image.height + y);

    image.anchor.set(0.5);
    image.x = (app.screen.width + (x * direction)) / 2;
    image.y = (app.screen.height + (y * direction)) / 2;

    if (windowAspectRatio > imageAspectRatio)
    {
      image.width = app.screen.width + x;
      image.height = (app.screen.width + x) / imageAspectRatio;
    }
    else
    {
      image.width = (app.screen.height + y) * imageAspectRatio;
      image.height = app.screen.height + y;
    }
  }

  function getNextTextureId()
  {
    for (let i = 0; i < textures.length; i++)
    {
      if (textures[i].name === activeImageId)
      {
        if (i < textures.length - 1)
        {
          return textures[i + 1].name;
        }
        else
        {
          return textures[0].name
        }
      }
    }
  }

  function getPreviousTextureId()
  {
    for (let i = 0; i < textures.length; i++)
    {
      if (textures[i].name === activeImageId)
      {
        if (i - 1 >= 0)
        {
          return textures[i - 1].name;
        }
        else
        {
          return textures[textures.length - 1].name
        }
      }
    }
  }

  // append PIXI canvas to DOM
  app.view.classList.add("background");

  $(".main").append(app.view);

  textures.forEach(resource => {
    loader.add(resource.name, resource.texture);
  });

  loader.load((loader, resources) => {

    activeImage = new PIXI.Sprite(resources[activeImageId].texture);
    nextImage = new PIXI.Sprite(resources[getNextTextureId()].texture);

    imageCover(activeImage, width, height);
    imageCover(nextImage, width, height);

    currentImageContainer.addChild(activeImage);
    nextImageContainer.addChild(nextImage);

    mainContainer.addChild(currentImageContainer);
    mainContainer.addChild(nextImageContainer);
    app.stage.addChild(mainContainer);

    // mask
    activeImageMask.position.x = 0;
    activeImageMask.position.y = 0;
    activeImageMask.lineStyle(0);
    activeImageMask.beginFill(0x8bc5ff, 0.4);
    activeImageMask.moveTo(0, 0);
    activeImageMask.lineTo(0, height);
    activeImageMask.lineTo(width, height);
    activeImageMask.lineTo(width, 0);
    mainContainer.addChild(activeImageMask);

    nextImageMask.position.x = 0;
    nextImageMask.position.y = 0;
    nextImageMask.lineStyle(0);
    nextImageMask.beginFill(0x8bc5ff, 0.4);
    nextImageMask.moveTo(0, height);
    nextImageMask.lineTo(0, height);
    nextImageMask.lineTo(width, height);
    nextImageMask.lineTo(width, height);
    mainContainer.addChild(nextImageMask);

    currentImageContainer.mask = activeImageMask;
    nextImageContainer.mask = nextImageMask;

    let isAnimating = false;

    function goto(toTextureId, direction)
    {
      if (isAnimating === true)
      {
        return;
      }

      if (toTextureId === activeImageId)
      {
        return;
      }

      isAnimating = true;

      nextImage.texture = resources[toTextureId].texture;

      let tl = new TimelineMax({
        onComplete: function () {
          activeImageId = toTextureId;
          activeImageMask.moveTo(0, 0);
          activeImageMask.lineTo(0, height);
          activeImageMask.lineTo(width, height);
          activeImageMask.lineTo(width, 0);
          nextImageMask.clear();
          activeImage.texture = resources[toTextureId].texture;
          activeImage.width = nextImage.width;
          activeImage.height = nextImage.height;
          nextImageBlurFilter.blur = 0;
          activeImageBlurFilter.blur = 0;
          isAnimating = false;

          PubSub.publish("pageChanged", {
            page: toTextureId
          });
        }
      });

      let seed = Math.random();
      let rand = Math.random() * width;

      let isMobile = false; //window.innerWidth <= 768;

      nextImageBlurFilter.blur = 0;
      activeImageBlurFilter.blur = 0;

      nextImage.filters = [nextImageBlurFilter];
      activeImage.filters = [activeImageBlurFilter];

      let obj = {
        a: direction < 0 ? 1 : 0,
        b: 0
      };

      tl.to(obj, 1.5, {
        a: direction < 0 ? 0 : 1,
        b: 1,
        ease: direction < 0 ? Power3.easeInOut : Power3.easeInOut,
        onUpdate: function () {
          activeImageMask.clear();
          nextImageMask.clear();

          activeImageMask.beginFill(0x8bc5ff, 0.4);
          nextImageMask.beginFill(0x8bc5ff, 0.4);

          perlinOffset += 10;

          let heightMultiplier = Math.sin(obj.a * Math.PI);


          if (direction < 0)
          {
            activeImageMask.moveTo(0, 0);
            nextImageMask.moveTo(0, height * 2);

            for (let x = 0; x < width; x++)
            {
              let y = Perlin(Math.sin(seed), (rand + x) / 100, 0) * (300 * heightMultiplier) + height * obj.a;
              activeImageMask.lineTo(x, y);
              nextImageMask.lineTo(x, y);
            }

            activeImageMask.lineTo(width, 0);
            nextImageMask.lineTo(width, height * 2);

            activeImageBlurFilter.blur = 20 * (1 - obj.a);
            nextImageBlurFilter.blur = 20 * obj.a;
          }
          else
          {

            activeImageMask.moveTo(0, height);
            nextImageMask.moveTo(0, 0);

            for (let x = 0; x < width; x++)
            {
              let y = Perlin(Math.sin(seed), (rand + x) / 100, 0) * (300 * heightMultiplier) + height * obj.a;

              activeImageMask.lineTo(x, y);
              nextImageMask.lineTo(x, y);
            }

            activeImageMask.lineTo(width + 10, height);
            nextImageMask.lineTo(width + 10, 0);

            nextImageBlurFilter.blur = 20 * (1 - obj.a);
            activeImageBlurFilter.blur = 20 * obj.a;
          }
        }
      });

      let obj2 = {val: 0};
      let scaleDirection = Math.random() < 0.5 ? -1 : 1;

      new TimelineMax().to(obj2, 1.5, {
        val: 1,
        ease: Power0.easeNone,
        onUpdate: function () {
          let aspectRatio = activeImage.width / activeImage.height;
          let scale = obj2.val * 30;
          let x = 0;
          let y = 0;

          if (aspectRatio > 0)
          {
            x = scale;
            y = scale / aspectRatio;
          }
          else
          {
            x = scale / aspectRatio;
            y = scale;
          }

          scaleImage(nextImage, x, y, 0);
        }
      });

    }

    PubSub.subscribe("scrollUp", function () {
      PubSub.publish("gotoPage", {
        to: getPreviousTextureId(),
        direction: 1
      });
    });

    PubSub.subscribe("scrollDown", function () {
      PubSub.publish("gotoPage", {
        to: getNextTextureId(),
        direction: -1
      });
    });

    PubSub.subscribe("swipeUp", function () {
      PubSub.publish("gotoPage", {
        to: getNextTextureId(),
        direction: -1
      });
    });

    PubSub.subscribe("swipeDown", function () {
      PubSub.publish("gotoPage", {
        to: getPreviousTextureId(),
        direction: 1
      });
    });

    PubSub.subscribe("gotoPage", function (msg, data) {
      goto(data.to, data.direction !== undefined ? data.direction : -1);
    });

    // resize PIXI on window resize
    PubSub.subscribe("windowResize", function (msg, data) {
      resizeScene(data);
    });

    resizeScene({
      width: window.innerWidth,
      height: window.innerHeight
    });

    ticker.add(function () {
      if (window.innerWidth !== width || window.innerHeight !== height) {
        resizeScene({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    });

    class VisualizationLine
    {
      constructor(width, height)
      {
        this.graphics = new PIXI.Graphics();
        this.time = Math.floor(Math.random() * 65535);
        this.width = width;
        this.height = height;
        this.points = [];

        for (let i = width - 1; i >= 0; i--)
        {
          this.points[i] = this.GetNextPoint();
        }
      }

      Y(perlin, frequencyData)
      {
        let heightMultiplier = this.GetAmplitude(frequencyData) * 128;
        let vh = this.height * heightMultiplier;

        return perlin * vh + height / 2 - vh / 2;
      }

      Update(width, height, frequencyData)
      {
        this.width = width;
        this.height = height;
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff);
        this.graphics.moveTo(0, this.Y(this.points[0], frequencyData));

        this.points.pop();
        this.points.unshift(this.GetNextPoint());

        for (let i = 0; i < this.width; i++)
        {
          this.graphics.lineTo(i, this.Y(this.points[i], frequencyData));
        }
      }

      GetAmplitude(frequencyData)
      {
        return frequencyData.reduce((a, b) => a + b) / frequencyData.length / 256;
      }

      GetNextPoint()
      {
        this.time++;
        return Perlin(this.time / 100, 0, 0);
      }

      Graphics()
      {
        return this.graphics;
      }
    }


    // let lines = [];
    //
    // for (let i = 0; i < 1; i++)
    // {
    //   lines.push(new VisualizationLine(width, 100));
    //   mainContainer.addChild(lines[i].Graphics());
    // }


    let colors = [];
    colors.push(0xe65100);
    colors.push(0xff8f00);
    colors.push(0xfbc02d);
    colors.push(0xeeff41);
    colors.push(0xc6ff00);
    colors.push(0x76ff03);
    colors.push(0x1de9b6);
    colors.push(0x00b0ff);
    colors.push(0x3d5afe);


    //let circles  = new PIXI.Graphics();
    //let circlesY = new Array(128).fill(0).map(() => Math.floor(Math.random() * height));

    //mainContainer.addChild(circles);


    let circlesContainer = new PIXI.Container();
    let circles = [];
    let radiusMultiplier = 1;
    let isMobileDevice = isMobile();
    let moveSpeed = .5;

    if (isMobileDevice === true) {
      radiusMultiplier = 0.5;
    }

    for (let i = 0; i < 128; i++)
    {
      let circle = new PIXI.Graphics();
      let x = i * Math.floor(width / 128) + 50;
      let y = Math.floor(Math.random() * height);
      circle.position.set(x, y);
      circle.direction = Math.random() > .5 ? 1 : -1;
      circle.speed = Math.round((128 - i) / 64 + 1) + Math.random() * 2;
      circle.radiusMultiplier = radiusMultiplier;
      circles.push(circle);
      circlesContainer.addChild(circle);
    }

    mainContainer.addChild(circlesContainer);

    function drawAudioVisualization(frequencyData)
    {
      for (let i = 0; i < frequencyData.length; i++)
      {
        circles[i].clear();
        circles[i].beginFill(colors[Math.round(i / 16)]);
        circles[i].lineStyle(0);

        // let radius = Math.max(10, frequencyData[i] / 3);
        let radius = frequencyData[i] / 3 * circles[i].radiusMultiplier;

        circles[i].position.x = width - i * Math.floor(width / 128) - 50;
        circles[i].position.y += circles[i].speed * circles[i].direction * moveSpeed;

        if (circles[i].direction > 0) {
          if (circles[i].position.y >= height) {
            circles[i].direction = -1;
          }
        }
        else {
          if (circles[i].position.y <= 0) {
            circles[i].direction = 1;
          }
        }

        circles[i].drawCircle(0, 0, radius);
        circles[i].endFill();
      }

    }

    PubSub.subscribe("backgroundAudioReady", function (msg, data) {

      PubSub.publish("audioReadyMessageReceived");

      let bufferLength = data.analyser.frequencyBinCount;
      let frequencyData = new Uint8Array(bufferLength);

      ticker.add(function () {
        data.analyser.getByteFrequencyData(frequencyData);
        drawAudioVisualization(frequencyData);

        PubSub.publish("frequencyDataUpdated", frequencyData);
      });
    });

  });


})();