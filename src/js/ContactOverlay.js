import PubSub from "pubsub-js";
import {TimelineMax} from "gsap";


(function ($) {
  const $contact = $(".contact-overlay");

  $contact.find("form").on("submit", function (e) {
    e.preventDefault();

    let $subject = $(this).find("[name=\"subject\"]");
    let $message = $(this).find("[name=\"message\"]");

    window.open(
      "mailto:online7890@gmail.com?subject=" + $subject.val() + "&body=" + $message.val(),
      "_blank"
    );

    $subject.val("");
    $message.val("");
  });

  PubSub.subscribe("openMenu", function (msg, data) {

    let timeLine = new TimelineMax();

    timeLine.fromTo($contact, .5, {left: "100%"}, {left: "0%"}, 0);

    if (data.open === false)
    {
      timeLine.reverse(0);
    }
  });
})(jQuery);


