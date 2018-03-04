import PubSub from "pubsub-js";
import {TimelineMax} from "gsap";
import {Back} from "gsap";

const $slides = $("[data-slide]");

PubSub.subscribe("gotoSlide", function (msg, data) {
  let $currentSlide = $("[data-slide=\"" + data.from + "\"");
  let $nextSlide = $("[data-slide=\"" + data.to + "\"");
  let $currentSlideElements = $currentSlide.find("[data-animate]");
  let $nextSlideElements = $nextSlide.find("[data-animate]");

  new TimelineMax()
    .set($slides, {zIndex: 10})
    .set($currentSlide, {zIndex: 11})
    .set($nextSlide, {zIndex: 12});


  let timeLine = new TimelineMax({
    onComplete: () => {
      // new TimelineMax()
      //   .set($nextSlide, {
      //     zIndex: 10
      //   });
    }
  });

  let direction = data.from - data.to;

  if (direction < 0)
  {
    timeLine
      .fromTo($currentSlideElements, 0.5, {
        y: 0,
        opacity: 1
      }, {
        y: -100,
        opacity: 0
      }, 0)
      .fromTo($nextSlide, 0.5, {top: "100%"}, {top: "0%"}, 0);
  }
  else
  {
    timeLine
      .fromTo($nextSlide, 0.5, {top: "-100%"}, {top: "0%"}, 0)
      .staggerFromTo($nextSlideElements, 1.5, {
        y: -50,
        opacity: 0,
        ease: Back.ease
      }, {
        y: 0,
        opacity: 1,
        ease: Back.ease
      }, 0.2, 0);
  }
});

PubSub.subscribe("pageLoaded", function (msg, data) {
  let $elements = $(".home [data-animate]");

  new TimelineMax()
    .staggerFromTo($elements, 1.5, {
      y: -50,
      opacity: 0,
      ease: Back.ease
    }, {
      y: 0,
      opacity: 1,
      ease: Back.ease
    }, 0.2, 0);
});