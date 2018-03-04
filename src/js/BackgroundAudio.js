import PubSub from "pubsub-js";
import isMobile from "is-mobile";
import {TimelineMax} from "gsap";

(function () {
  let audio = document.createElement("audio");
  let context = new AudioContext();
  let mediaSrc = null;
  let analyser = null;
  let sendReadyMessage = true;
  let maxVolume = .1;

  // audio.src = require("../audio/Lord of the Isles - Teach Them No Hate.mp3");
  audio.src = require("../audio/Portugal. The Man - Feel It Still.mp3");

  audio.volume = maxVolume;
  audio.loop = true;
  // audio.currentTime = 90;

  if (isMobile() === true)
  {
    $(document.body).on("click", function () {
      audio.play();
    });
  }
  else
  {
    audio.play();
  }

  audio.addEventListener("canplay", function () {
    mediaSrc = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    mediaSrc.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 256;
  });

  audio.addEventListener("timeupdate", function () {
    if (sendReadyMessage === true) {
      PubSub.publish("backgroundAudioReady", {
        audio: audio,
        analyser: analyser
      });
    }
  });

  PubSub.subscribe("audioReadyMessageReceived", function () {
    sendReadyMessage = false;
  });

  PubSub.subscribe("audioButtonClicked", function () {
    if (audio.paused === false) {
      new TimelineMax({
        onComplete: function () {
          audio.pause();
        }
      }).to(audio, .5, {
        volume: 0,
        ease: Power2.easeOut
      });
    }
    else {
      audio.play();
      new TimelineMax().to(audio, .5, {
        volume: maxVolume,
        ease: Power2.easeIn
      });
    }
  });

})();