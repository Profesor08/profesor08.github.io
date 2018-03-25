import {TimelineMax} from "gsap";

(function () {


  let $works = $(".work-project");

  $works.each(function () {
    let $work = $(this);
    let $image = $work.find(".image");
    let $bubble = $(`<div class="bubble">`);
    
    function calcHypotenuse(a, b)
    {
      return Math.sqrt(a * a + b * b);
    }

    $image.append($bubble);

    $work.on("mouseenter", function () {

      let size = calcHypotenuse($image.width(), $image.height());

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
    });

    $work.on("mouseleave", function () {
      // $work.toggleClass("is-active");
    });

  });

})();