import PubSub from "pubsub-js";
import {TimelineMax} from "gsap";

(function () {
  let currentPage = "home";
  let $pages = $(".main [data-page]");
  let isAnimating = false;

  const animationTime = 3;

  PubSub.subscribe("gotoPage", function (msg, data) {

    if (isAnimating === false && currentPage !== data.to)
    {
      showPage(data.to);
    }
  });

  function showPage(page)
  {
    isAnimating = true;
    let $current = $pages.filter(`[data-page="${currentPage}"]`);
    let $next = $pages.filter(`[data-page="${page}"]`);

    $next.addClass("is-active");

    new TimelineMax({
      onComplete: function () {
        $current.removeClass("is-active");
        isAnimating = false;
      }
    }).fromTo($current, animationTime / 4, {
      opacity: 1
    }, {
      opacity: 0
    }).fromTo($next, animationTime / 4, {
      opacity: 0
    }, {
      opacity: 1
    }, "+=" + (animationTime / 2));

    currentPage = page;
  }

})();