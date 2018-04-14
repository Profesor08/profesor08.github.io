import PubSub from "pubsub-js";
import {TimelineMax} from "gsap";
import Ticker from "./Ticker";

(function () {

  function getAmplitude(frequencyData) {
    return frequencyData.reduce((a, b) => a + b) / frequencyData.length / 256;
  }

  function buttonLinesUpdate(value) {
    if (value < .5) {
      $line3.removeClass("is-active");
    }
    else {
      $line3.addClass("is-active");
    }

    if (value < .25) {
      $line2.removeClass("is-active");
    }
    else {
      $line2.addClass("is-active");
    }

    if (value === 0) {
      $line1.removeClass("is-active");
    }
    else {
      $line1.addClass("is-active");
    }
  }

  function animate() {
    if (analyser === null) {
      return;
    }

    let frequencyData = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(frequencyData);

    let amplitude = getAmplitude(frequencyData);
    let multiplier = amplitude * 20;

    let lineX = multiplier - 1;

    let scale = Math.min(amplitude * 5 + 1, 1.5);

    $line1.attr("transform", `translate(${lineX}, 0)`);
    $line2.attr("transform", `translate(${lineX * 1.5}, 0)`);
    $line3.attr("transform", `translate(${lineX * 2}, 0)`);

    // $speaker.attr("transform", `scale(${scale})`);
  }

  function openVolume() {
    $volumeControl.addClass("is-active");
    $button.addClass("is-active");

    new TimelineMax().to($volumeControl, .3, {
      opacity: 1
    });
  }

  function closeVolume() {
    new TimelineMax().to($volumeControl, .3, {
      opacity: 0,
      onComplete: function () {
        $volumeControl.removeClass("is-active");
        $button.removeClass("is-active");
      }
    });
  }

  let $button = $(".audio-button");

  let $line1 = $button.find(".audio-line-1");
  let $line2 = $button.find(".audio-line-2");
  let $line3 = $button.find(".audio-line-3");

  let $speaker = $button.find(".audio-speaker");

  let $volumeControl = $(".volume-control");
  let $volumeSlider = $(".volume-control input");

  $volumeSlider.attr("value", localStorage["soundVolume"] ? parseFloat(localStorage["soundVolume"]) : .3);
  $volumeSlider.attr("min", 0.0);
  $volumeSlider.attr("max", 1.0);
  $volumeSlider.attr("step", 0.001);

  buttonLinesUpdate(parseFloat(localStorage["soundVolume"]));

  let analyser = null;

  Ticker.add(animate);

  PubSub.subscribe("backgroundAudioReady", function (msg, data) {
    analyser = data.analyser;
  });

  PubSub.subscribe("openSidebar", (msg, data) => {
    $button.addClass("on-sidebar");
  });

  PubSub.subscribe("closeSidebar", (msg, data) => {
    $button.removeClass("on-sidebar");
  });

  $volumeSlider.on("input", function () {
    let value = parseFloat(this.value);

    buttonLinesUpdate(value);

    PubSub.publish("volumeChanged", {
      volume: value
    });
  });

  $button.on("click", function () {
    openVolume();
  });

  $button.on("blur", function () {
    closeVolume();
  });

  $(".main, .pagination, .hamburger, .sidebar").on("click", function () {
    closeVolume();
  });


})();