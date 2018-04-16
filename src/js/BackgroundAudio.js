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
  let maxVolume = localStorage["soundVolume"] ? parseFloat(localStorage["soundVolume"]) : .3;
  let animationTime = 3;
  let tracks = [];
  let currentTrack = -1;
  let sound = null;
  let $nextButton = $(".next-track");

  axios.get(tracksUrl).then(function (res) {
    tracks = res.data;

    if (tracks.length > 0) {
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].id === 325841984) {
          loadTrack(i, function (sound) {
            sound.play();
          });

          break;
        }
      }
    }
  });

  $nextButton.on("click", function () {
    sound.stop();
  });

  PubSub.subscribe("volumeChanged", function (msg, data) {
    maxVolume = data.volume;
    localStorage["soundVolume"] = data.volume;
  });

  function loadTrack(id, callback) {
    if (tracks[id] !== undefined) {
      let track = tracks[id];

      if (track.sound === undefined) {
        const analyser = Pizzicato.context.createAnalyser();

        const lowPassFilter = new Pizzicato.Effects.LowPassFilter({
          frequency: 4000,
          peak: 0
        });

        const stereoPanner = new Pizzicato.Effects.StereoPanner({
          pan: 0
        });

        let half = animationTime / 2;
        let quad = animationTime / 4;

        let sound = new Pizzicato.Sound({
          source: "file",
          options: {
            // loop: true,
            volume: maxVolume,
            path: getTrackUrl(track),
            attack: .4,
            release: .4
          }
        }, function () {
          sound.addEffect(stereoPanner);
          sound.addEffect(lowPassFilter);
          sound.connect(analyser);

          if (callback instanceof Function) {
            callback(sound);
          }
        });

        sound.on("play", function () {
          PubSub.publish("backgroundAudioReady", {
            analyser: analyser
          });

          loadTrack(getNextTrackId(id));
        });

        sound.on("end", function () {
          tracks[getNextTrackId(id)].sound.play();
        });

        track.sound = sound;

        PubSub.subscribe("volumeChanged", function (msg, data) {
          sound.volume = data.volume;
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
      }
    }
  }

  function getNextTrackId(id) {
    if (id + 1 < tracks.length) {
      return id + 1;
    }

    return 0;
  }

})();