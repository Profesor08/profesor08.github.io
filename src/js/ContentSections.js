import PubSub from "pubsub-js";
import {TimelineMax} from "gsap";

(function () {
  let currentPage = "home";
  let $pages = $(".main [data-page]");

  PubSub.subscribe("gotoPage", function (msg, data) {

    if (currentPage !== data.to)
    {
      showPage(data.to);
    }
  });

  function showPage(page)
  {
    let $current = $pages.filter(`[data-page="${currentPage}"]`);
    let $next = $pages.filter(`[data-page="${page}"]`);

    $next.addClass("is-active");

    new TimelineMax({
      onComplete: function () {
        $current.removeClass("is-active");
      }
    }).fromTo($current, .75, {
      opacity: 1
    }, {
      opacity: 0
    }).fromTo($next, .75, {
      opacity: 0
    }, {
      opacity: 1
    });

    console.log($current, $next);
    console.log(currentPage, page);

    currentPage = page;
  }

})();