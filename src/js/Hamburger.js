import {TimelineMax} from "gsap";
import PubSub from "pubsub-js";

export default class Hamburger
{
  constructor(selector)
  {
    this.$hamburger = $(selector);

    this.events = {
      open: [],
      close: []
    };

    this.$hamburger.on("click", () => {
      this.toggle();
    });

    PubSub.subscribe("openSidebar", () => {
      this.$hamburger.addClass("is-open");
    });

    PubSub.subscribe("closeSidebar", () => {
      this.$hamburger.removeClass("is-open");
    });
  }

  on(event, callback)
  {
    if (this.events.hasOwnProperty(event))
    {
      this.events[event].push(callback);
    }

    return this;
  }

  callEvent(event)
  {
    if (this.events.hasOwnProperty(event))
    {
      this.events[event].forEach(callback => {
        if (typeof callback === "function")
        {
          callback();
        }
      });
    }
  }

  open()
  {
    this.callEvent("open");
  }

  close()
  {
    this.callEvent("close");
  }

  toggle()
  {
    this.$hamburger.toggleClass("is-open");

    if (this.$hamburger.hasClass("is-open"))
    {
      this.open();
    }
    else
    {
      this.close();
    }
  }
}