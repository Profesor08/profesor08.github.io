import PubSub from "pubsub-js";
import {TimelineMax} from "gsap";
import Hammer from "hammerjs";

(function () {

  let $overlay = $(".main-overlay");

  let tl = new TimelineMax();

  const hammer = new Hammer($overlay.get(0));

  hammer.get("swipe").set({
    direction: Hammer.DIRECTION_ALL
  });

  hammer.on("swipeleft", function (e) {
    PubSub.publish("mainOverlaySwipeLeft", e);
  });

  hammer.on("tap", function (e) {
    PubSub.publish("mainOverlayTap", e);
  });

  hammer.on("panright", function (e) {
    PubSub.publish("mainOverlayPanRight", e);
  });

  hammer.on("panleft", function (e) {
    PubSub.publish("mainOverlayPanLeft", e);
  });

  hammer.on("panend", function (e) {
    PubSub.publish("mainOverlayPanEnd", e);
  });

  PubSub.subscribe("openSidebar", function () {
    tl
      .clear()
      .set($overlay, {
        left: 0
      })
      .to($overlay, .5, {
        opacity: 1
      });
  });

  PubSub.subscribe("closeSidebar", function () {
    tl
      .clear()
      .to($overlay, .5, {
        opacity: 0
      })
      .set($overlay, {
        left: -9999
      });
  });

})();