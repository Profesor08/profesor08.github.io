import PubSub from "pubsub-js";
import {TimelineMax} from "gsap";

export default class Sidebar
{
  constructor(selector)
  {
    this.isOpen = false;
    this.$sidebar = $(selector);
    this.tl = new TimelineMax();

    this.tl.set(this.$sidebar, {
      xPercent: "-100%"
    });

    this.tl2 = new TimelineMax();

    this.tl2.to(this.$sidebar, .5, {
      xPercent: 0
    }).pause();

    PubSub.subscribe("openSidebar", (msg, data) => {
      this.open();
    });

    PubSub.subscribe("closeSidebar", (msg, data) => {
      this.close();
    });

    PubSub.subscribe("mainContentPanRight", (msg, event) => {
      // this.progress(event.deltaX);
    });

    PubSub.subscribe("mainContentPanLeft", (msg, event) => {
      // this.progress(event.deltaX);
    });

    PubSub.subscribe("mainContentPanEnd", (msg, event) => {
      // if (event.deltaTime >= 300) {
      //   this.continueSidebarState(event.deltaX);
      // }
    });

    PubSub.subscribe("mainContentSwipeRight", (msg, event) => {
      PubSub.publish("openSidebar");
    });

    PubSub.subscribe("mainOverlayTap", (msg, event) => {
      PubSub.publish("closeSidebar");
    });

    PubSub.subscribe("mainOverlaySwipeLeft", (msg, event) => {
      PubSub.publish("closeSidebar");
    });

  }

  continueSidebarState(x)
  {
    let sidebarWidth = window.innerWidth * .375;

    if (x >= sidebarWidth)
    {
      PubSub.publish("openSidebar");
    }
    else
    {
      PubSub.publish("closeSidebar");
    }
  }

  progress(x)
  {

    let sidebarWidth = window.innerWidth * .375;
    let progress = x >= 0 ? x <= sidebarWidth * 2 ? x / sidebarWidth / 2 : 1 : 0;

    if (this.isOpen === true)
    {
      // progress = 1 - progress;
    }

    this.tl2.progress(progress);
  }

  open()
  {
    this.tl.clear()
      // .set(this.$sidebar, {
      //   x: -9999
      // })
      .to(this.$sidebar, .5, {
        xPercent: 0,
        onUpdate: () => {
          this.isOpen = true;
        }
      });
  }

  close()
  {
    this.tl.clear()
      .to(this.$sidebar, .5, {
        xPercent: -100,
        onUpdate: () => {
          this.isOpen = false;
        }
      })
      // .to(this.$sidebar, 0, {
      //   // x: -9999
      // });
  }
}