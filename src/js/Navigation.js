import PubSub from "pubsub-js";
import Hammer from "hammerjs";

export default class Navigation
{
  constructor()
  {
    this.count = 3;
    this.delay = 500;
    this.currentSlide = 0;
    this.isBlocked = false;

    this.initScrollEvents();
    this.initClickEvents();
    this.initSwipeEvents();


  }

  initScrollEvents()
  {
    $(window).on("wheel", e => {

      if (this.isBlocked === true)
      {
        return;
      }

      let direction = e.originalEvent.deltaY > 0 ? 1 : -1;

      let nextSlide = this.currentSlide + direction;

      if (nextSlide >= this.count || nextSlide < 0)
      {
        return;
      }

      this.isBlocked = true;

      PubSub.publish("gotoSlide", {
        from: this.currentSlide,
        to: nextSlide
      });

      this.currentSlide = nextSlide;

      this.waitAnimations();
    });
  }

  initSwipeEvents()
  {
    const hammer = new Hammer(document.body);
    const $hamburger = $(".hamburger");

    hammer.get("swipe").set({
      direction: Hammer.DIRECTION_VERTICAL
    });

    hammer.on("swipe", e => {
      if (this.isBlocked === true)
      {
        return;
      }

      if ($hamburger.hasClass("is-open"))
      {
        return;
      }

      let direction = e.deltaY > 0 ? -1 : 1;

      let nextSlide = this.currentSlide + direction;

      if (nextSlide >= this.count || nextSlide < 0)
      {
        return;
      }

      this.isBlocked = true;

      PubSub.publish("gotoSlide", {
        from: this.currentSlide,
        to: nextSlide
      });

      this.currentSlide = nextSlide;

      this.waitAnimations();
    });
  }

  initClickEvents()
  {
    let _this = this;

    $(".pagination .page-item").on("click", function (e) {
      e.preventDefault();

      if (_this.isBlocked === true)
      {
        // return;
      }

      let nextSlide = $(this).data("goto-slide");

      if (_this.currentSlide !== nextSlide)
      {
        _this.isBlocked = true;

        PubSub.publish("gotoSlide", {
          from: _this.currentSlide,
          to: nextSlide
        });

        _this.currentSlide = nextSlide;

        _this.waitAnimations();
      }
    });
  }

  waitAnimations()
  {
    setTimeout(() => {
      this.isBlocked = false;
    }, this.delay);
  }
}