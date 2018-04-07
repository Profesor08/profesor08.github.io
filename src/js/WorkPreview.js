import {TimelineMax} from "gsap";
import PubSub from "pubsub-js";

export default function WorkPreview(url, title, description) {

  let $container = $($("#work-preview").html());
  let $imageContainer = $container.find(".image-container");
  let $imageBackground = $container.find(".image-background");
  let $loading = $container.find(".image-loading");
  let img = new Image();
  let tl = new TimelineMax();
  let imageLoaded = false;

  $(document.body).append($container);

  img.addEventListener("load", function () {
    imageLoaded = true;
    $imageContainer.append(img);
    showImage();
  });

  img.src = url;

  $container.find(".close-button").on("click", function () {
    close();
  });

  PubSub.subscribe("gotoPage", function () {
    close();
  });

  function showImage()
  {
    tl.to($imageContainer, .4, {
      opacity: 1
    });

    new TimelineMax().to($loading, .4, {
      opacity: 0
    }).set($loading, {
      display: "none"
    });
  }

  function show()
  {
    tl.set($container, {
      top: 0,
      left: 0
    })
      .fromTo($container, .4, {
        opacity: 0
      }, {
        opacity: 1
      });

    PubSub.publish("workPreviewShow");
  }

  function close()
  {
    new TimelineMax()
      .fromTo($container, .4, {
        opacity: 1
      }, {
        opacity: 0,
        onComplete: function () {
          $container.remove();
          showImage();
        }
      });

    PubSub.publish("workPreviewClose");
  }

  return {
    show,
    close
  }
}