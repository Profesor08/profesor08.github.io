import PubSub from "pubsub-js";
import {TimelineMax} from "gsap";

(function () {
  const $pagination = $(".pagination");
  const $items = $pagination.find(".page-item");
  const $fluid = $pagination.find(".fluid");
  const $fluidItemsBig = $pagination.find(".fluid-item.full-size");
  const $fluidItemsSmall = $pagination.find(".fluid-item:not(.full-size)");

  let ready = true;
  let currentIndex = 0;
  let previousIndex = 0;
  let currentPage = null;

  function setActiveItem(page)
  {
    $items.removeClass("is-active");
    // $pagination.find(`[data-goto-page="${page}"]`).addClass("is-active");
  }

  function playFluidAnimation()
  {
    let targetTop = $items[currentIndex].offsetTop + 10;

    let tl = new TimelineMax();

    let direction = Math.random() < .5 ? -1 : 1;

    tl.to($fluidItemsBig.get(0), .8, {
      top: targetTop,
      ease: Power1.easeInOut,
      onUpdate: function () {
        let val = this.time() * (1 / .8);
        let left = 5 * Math.sin(val * Math.PI) * direction + 10;
        this.target.style.setProperty("left", left + "px");
      }
    });

    tl.staggerTo($fluidItemsSmall, .8, {
      top: targetTop + 3,
      ease: Power1.easeInOut,
      onUpdate: function () {
        let val = this.time() * (1 / .8);
        let left = 3 + 5 * Math.sin(val * Math.PI) * direction + 10;
        this.target.style.setProperty("left", left + "px");
      }
    }, 0.1, "-=0.7");


  }

  $items.on("click", function () {
    let page = $(this).data("goto-page");

    if (page !== currentPage) {
      PubSub.publish("gotoPage", {
        to: page
      });
    }
  });

  PubSub.subscribe("gotoPage", function (msg, data) {
    if (ready === true)
    {
      setActiveItem(data.to);

      previousIndex = currentIndex;
      currentIndex = $pagination.find(`[data-goto-page="${data.to}"]`).index();

      playFluidAnimation();

      ready = false;
    }
  });

  PubSub.subscribe("pageChanged", function (msg, data) {
    setActiveItem(data.page);
    ready = true;
  });
})();