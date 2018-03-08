import PubSub from "pubsub-js";

(function() {

  let $nav = $(".sidebar .navigation");
  let $items = $nav.find(".nav-item");

  $items.on("click", function (event) {
    event.preventDefault();

    let page = $(this).data("goto-page");

    $items.removeClass("is-active");

    PubSub.publish("gotoPage", {
      to: page
    });

    PubSub.publish("closeSidebar");
  });

  PubSub.subscribe("gotoPage", function (msg, data) {
    $nav.find(`.nav-item[data-goto-page="${data.to}"]`).addClass("is-active");
  });
})();