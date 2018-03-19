import PubSub from "pubsub-js";
import {TimelineMax} from "gsap";
import Hammer from "hammerjs";

export default class MainContent
{
  constructor(selector)
  {
    this.$content = $(selector);
    this.tl = new TimelineMax();
    this.shifted = false;
    // const hammer = new Hammer(this.$content.get(0));

    // this.tl2 = new TimelineMax();
    //
    // let obj = {a: 0};
    //
    // this.tl2.to(this.$content, .5, {
    //   x: () => window.innerWidth * 0.374,
    //   width: () => window.innerWidth / 100 * (100 - 37.4)
    // }).pause();

    // hammer.get("swipe").set({
    //   direction: Hammer.DIRECTION_ALL
    // });
    //
    // hammer.on("swipeup", function (e) {
    //   PubSub.publish("swipeUp");
    // });
    //
    // hammer.on("swipedown", function (e) {
    //   PubSub.publish("swipeDown");
    // });
    //
    // hammer.on("swipeleft", function (e) {
    //   PubSub.publish("mainContentSwipeLeft");
    // });
    //
    // hammer.on("swiperight", function (e) {
    //   PubSub.publish("mainContentSwipeRight");
    // });
    //
    // hammer.on("panright", function (e) {
    //   PubSub.publish("mainContentPanRight", e);
    // });
    //
    // hammer.on("panleft", function (e) {
    //   PubSub.publish("mainContentPanLeft", e);
    // });
    //
    // hammer.on("panend", function (e) {
    //   PubSub.publish("mainContentPanEnd", e);
    // });

    PubSub.subscribe("openSidebar", (msg, data) => {
      this.shiftLeft();
    });

    PubSub.subscribe("closeSidebar", (msg, data) => {
      this.restore();
    });

    PubSub.subscribe("mainContentSwipe", (msg, event) => {
      console.log(event);
    });

    PubSub.subscribe("windowResize", (msg, data) => {
      if (this.shifted === true)
      {
        this.shiftLeft();
      }
    });

    PubSub.subscribe("mainContentPanRight", (msg, event) => {
      // this.progress(event.deltaX);
    });

    PubSub.subscribe("mainContentPanLeft", (msg, event) => {
      // this.progress(event.deltaX);
    });

    PubSub.subscribe("mainContentPanEnd", (msg, event) => {
      // if (event.deltaTime >= 300)
      // {
      //   this.continueMainContentState(event.deltaX);
      // }
    });

    PubSub.subscribe("mainOverlayPanRight", (msg, e) => {
      // PubSub.publish("mainContentPanRight", e);
    });

    PubSub.subscribe("mainOverlayPanLeft", (msg, e) => {
      // PubSub.publish("mainContentPanLeft", e);
    });

    PubSub.subscribe("mainOverlayPanEnd", (msg, e) => {
      // PubSub.publish("mainContentPanEnd", e);
    });
  }

  continueMainContentState(x)
  {
    let sidebarWidth = window.innerWidth * .375;

    if (x >= sidebarWidth)
    {
      this.shiftLeft();
    }
    else
    {
      this.restore();
    }
  }

  progress(x)
  {
    console.log(x);
    let sidebarWidth = window.innerWidth * .375;
    let progress = x >= 0 ? x <= sidebarWidth * 2 ? x / sidebarWidth / 2 : 1 : 0;
    this.tl2.progress(progress);
  }

  shiftLeft()
  {
    if (window.innerWidth > 768)
    {
      this.tl.clear()
        .to(this.$content, .5, {
          x: window.innerWidth * 0.374,
          width: window.innerWidth / 100 * (100 - 37.4),
        });
    }
    else
    {
      // this.tl.clear()
      //   .to(this.$content, .5, {
      //     xPercent: 100
      //   });
    }

    this.shifted = true;
  }

  restore()
  {
    this.tl.clear()
      .to(this.$content, .5, {
        x: 0,
        width: window.innerWidth
      })
      .to(this.$content, 0, {
        width: "100%"
      });

    this.shifted = false;
  }
}