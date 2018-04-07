import {TimelineMax} from "gsap";
import WorkPreview from "./WorkPreview";

(function () {

  let $works = $(".work-project");

  $works.each(function () {
    let $work = $(this);
    let $image = $work.find(".image");
    let $bubble = $(`<div class="bubble">`);

    $image.append($bubble);

    // Animate bubble
    $work.find(".project-container").on("mouseenter", function () {
      let size = Math.hypot($image.width(), $image.height());

      new TimelineMax()
        .fromTo($bubble, .400, {
          width: 0,
          height: 0,
          opacity: 1
        }, {
          width: size,
          height: size,
          opacity: 0
        })
        .set($bubble, {
          width: 0,
          height: 0,
          opacity: 1
        });
    }).on("click", function() {
      let url = $(this).data("src");
      let preview = new WorkPreview(url);

      preview.show();

    });

  });

})();