import "pixi.js";
import {TimelineMax, Power3} from "gsap";
import Perlin from "./Perlin";
import PubSub from "pubsub-js";

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
    }
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
      if (window.innerWidth !== width || window.innerHeight !== height) {
        resizeScene({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    });

  });


})();