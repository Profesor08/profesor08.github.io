import PubSub from "pubsub-js";

(function () {

  function getAmplitude(frequencyData)
  {
    return frequencyData.reduce((a, b) => a + b) / frequencyData.length / 256;
  }

  let $button = $(".audio-button");

  let $line1 = $button.find(".audio-line-1");
  let $line2 = $button.find(".audio-line-2");
  let $line3 = $button.find(".audio-line-3");

  let $speaker = $button.find(".audio-speaker");

  PubSub.subscribe("frequencyDataUpdated", function (msg, frequencyData) {

    let amplitude = getAmplitude(frequencyData);
    let multiplier = amplitude * 20;

    let lineX = multiplier - 1;

    let scale = Math.min(amplitude * 5 + 1, 1.5);

    $line1.attr("transform", `translate(${lineX}, 0)`);
    $line2.attr("transform", `translate(${lineX * 1.5}, 0)`);
    $line3.attr("transform", `translate(${lineX * 2}, 0)`);

    $speaker.attr("transform", `scale(${scale})`);

  });

  PubSub.subscribe("openSidebar", (msg, data) => {
    $button.addClass("on-sidebar");
  });

  PubSub.subscribe("closeSidebar", (msg, data) => {
    $button.removeClass("on-sidebar");
  });

  $button.on("click", function () {
    PubSub.publish("audioButtonClicked");
  });


})();