import PubSub from "pubsub-js";
import Hammer from "hammerjs";

(function () {

  const home = document.querySelector(".home");
  const hammer = new Hammer(home);

  hammer.get('swipe').set({
    direction: Hammer.DIRECTION_ALL
  });

  hammer.on("swipeup", function () {
    PubSub.publish("gotoPage", {
      to: "works"
    });
  });

  hammer.on("swipedown", function () {
    PubSub.publish("gotoPage", {
      to: "contact"
    });
  });

  home.addEventListener("mousewheel", function (event) {
    if (event.deltaY > 0) {
      PubSub.publish("gotoPage", {
        to: "works"
      });
    }
    else {
      PubSub.publish("gotoPage", {
        to: "contact"
      });
    }
  })

})();