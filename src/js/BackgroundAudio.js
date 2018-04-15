import PubSub from "pubsub-js";
import {TimelineMax} from "gsap";
import Pizzicato from "pizzicato";
import axios from "axios";
import buildUrl from "build-url";

(function () {

  function SC_Url(url, query) {
    query = Object.assign({}, {
      client_id: "e9f897e4636fc2682a1c243b511d30b8",
      format: "json"
    }, query);

    return buildUrl(url, {
      queryParams: query
    });
  }
  function getTrackUrl(track) {
    return SC_Url(track.stream_url);
  }

  function getnextTrack() {
    if (currentTrack + 1 === tracks.length) {
      currentTrack = 0;
    }
    else {
      currentTrack += 1;
    }

    return tracks[currentTrack];
  }

  let tracksUrl = SC_Url("https://api.soundcloud.com/resolve", {
    url: "https://soundcloud.com/profesor08/likes"
  });

  const audioSourceUrl = require("../audio/xmas.evs-loop.mp3");
  // const audioSourceUrl = require("../audio/Portugal. The Man - Feel It Still.mp3");
  // const audioSourceUrl = require("../audio/Lord of the Isles - Teach Them No Hate.mp3");
  const maxVolume = localStorage["soundVolume"] ? parseFloat(localStorage["soundVolume"]) : .3;
  const animationTime = 3;
  let tracks = [];
  let currentTrack = 0;

  axios.get(tracksUrl).then(function (res) {
    tracks = res.data;

    if (tracks.length > 0) {
      initSound(getTrackUrl(tracks[0]));
    }
  });

  function initSound(trackUrl) {
    const sound = new Pizzicato.Sound({
      source: "file",
      options: {
        // loop: true,
        volume: maxVolume,
        path: trackUrl,
        attack: 0.4,
        release: 0.4
      }
    }, function () {

      sound.on("end", function () {
        initSound(getTrackUrl(getnextTrack()));
      });

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

    PubSub.subscribe("volumeChanged", function (msg, data) {
      sound.volume = data.volume;
      localStorage["soundVolume"] = data.volume;
    });

    PubSub.subscribe("audioButtonClicked", function () {
      if (sound.playing === true) {
        new TimelineMax({
          onComplete: function () {
            sound.pause();
          }
        }).to(sound, .5, {
          volume: 0,
          ease: Power2.easeOut
        });
      }
      else {
        sound.play();
        new TimelineMax().to(sound, .5, {
          volume: maxVolume,
          ease: Power2.easeIn
        });
      }
    });
  }



})();