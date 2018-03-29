import PubSub from 'pubsub-js';

(function () {

  let $home = $(".home-3d-scene");
  let $greetings = $(".greetings");
  let $window = $(window);
  let isActive = true;

  PubSub.subscribe("gotoPage", function (msg, data) {
    isActive = data.to === "home";
  });

  // 3D transform
  $home.css({
    transformOrigin: "50% 50%",
    transformStyle: "preserve-3d",
  });

  $window.on("mousemove", function (event) {
    if (isActive) {
      let mx = event.pageX;
      let my = event.pageY;
      let halfW = window.innerWidth / 2;
      let halfH = window.innerHeight / 2;

      let rotateY = Math.map(Math.abs(mx - halfW), 0, halfW, 0, 10);
      let rotateX = Math.map(Math.abs(my - halfH), 0, halfH, 0, 20);

      let left = Math.map(mx, 0, window.innerWidth, 0, 200);
      let top = Math.map(my, 0, window.innerHeight, -100, 100);

      if (mx - halfW < 0) {
        rotateY *= -1;
      }

      if (my - halfH > 0) {
        rotateX *= -1;
      }

      $greetings.css({
        transform: `perspective(900px) translate(${left}px, ${top}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      });
    }
  });

})();