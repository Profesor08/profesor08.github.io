import PubSub from 'pubsub-js';
import Hammer from "hammerjs";
import Ticker from "./Ticker";

(function () {

  let $home = $(".home-3d-scene");
  let $greetings = $(".greetings");
  let $main = $(".main");
  let isActive = true;

  PubSub.subscribe("gotoPage", function (msg, data) {
    isActive = data.to === "home";
  });

  // 3D transform
  $home.css({
    transformOrigin: "50% 50%",
    transformStyle: "preserve-3d",
  });

  let hammer = new Hammer($main.get(0));
  hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });

  hammer.on('panmove', function(event) {
    pos.mx = event.center.x;
    pos.my = event.center.y;
  });

  $main.on("mousemove", function (event) {
    pos.mx = event.pageX;
    pos.my = event.pageY;
  });

  let rect = $greetings.get(0).getBoundingClientRect();

  let pos = {
    mx: rect.x + rect.width / 2,
    my: rect.y + rect.height / 2,
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2
  };

  function animate() {
    if (isActive === true) {

      pos.x += (pos.mx - pos.x) * 0.05;
      pos.y += (pos.my - pos.y) * 0.05;

      let halfW = window.innerWidth / 2;
      let halfH = window.innerHeight / 2;

      let rotateY = Math.map(Math.abs(pos.x - halfW), 0, halfW, 0, 10);
      let rotateX = Math.map(Math.abs(pos.y - halfH), 0, halfH, 0, 20);

      let left = Math.map(pos.x, 0, window.innerWidth, 0, 200);
      let top = Math.map(pos.y, 0, window.innerHeight, -100, 100);

      if (pos.x - halfW < 0) {
        rotateY *= -1;
      }

      if (pos.y - halfH > 0) {
        rotateX *= -1;
      }

      $greetings.css({
        transform: `perspective(900px) translate(${left}px, ${top}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      });
    }
  }

  Ticker.add(animate);

})();