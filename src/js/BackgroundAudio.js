import PubSub from "pubsub-js";
import isMobile from "is-mobile";
import {TimelineMax} from "gsap";
import Pizzicato from "pizzicato";

(function () {

  const audioSourceUrl = require("../audio/xmas.evs-loop.mp3");
  // const audioSourceUrl = require("../audio/Portugal. The Man - Feel It Still.mp3");
  // const audioSourceUrl = require("../audio/Lord of the Isles - Teach Them No Hate.mp3");
  const maxVolume = 1;
  const animationTime = 3;

  const sound = new Pizzicato.Sound({
    source: "file",
    options: {
      loop: true,
      volume: maxVolume,
      path: audioSourceUrl
    }
  }, function () {

    const lowPassFilter = new Pizzicato.Effects.LowPassFilter({
      frequency: 4000,
      peak: 0
    });

    const stereoPanner = new Pizzicato.Effects.StereoPanner({
      pan: 0
    });

    const analyser = Pizzicato.context.createAnalyser();

    let half = animationTime / 2;
    let quad = animationTime / 4;

    sound.addEffect(stereoPanner);
    sound.addEffect(lowPassFilter);
    sound.play();
    sound.connect(analyser);

    PubSub.publish("backgroundAudioReady", {
      audio: sound,
      analyser: analyser
    });

    PubSub.subscribe("gotoPage", function () {

      new TimelineMax()
        .to(stereoPanner, half, {
          pan: -1
        })
        .fromTo(stereoPanner, half, {
          pan: -1
        }, {
          pan: 1
        })
        .to(stereoPanner, quad, {
          pan: 0
        });

      new TimelineMax()
        .to(lowPassFilter, half, {
          frequency: 146,
        })
        .to(lowPassFilter, half, {
          frequency: 4000,
          ease: Power0.easeNone
        }, "+=" + half);
    });

    PubSub.subscribe("workPreviewShow", function () {
      new TimelineMax()
        .to(lowPassFilter, half, {
          frequency: 146,
        });
    });

    PubSub.subscribe("workPreviewClose", function () {
      new TimelineMax()
        .to(lowPassFilter, half, {
          frequency: 4000,
          ease: Power0.easeNone
        });
    });

  });

  PubSub.subscribe("audioButtonClicked", function () {
    if (sound.playing === true)
    {
      new TimelineMax({
        onComplete: function () {
          sound.pause();
        }
      }).to(sound, .5, {
        volume: 0,
        ease: Power2.easeOut
      });
    }
    else
    {
      sound.play();
      new TimelineMax().to(sound, .5, {
        volume: maxVolume,
        ease: Power2.easeIn
      });
    }
  });

})();