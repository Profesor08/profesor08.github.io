import "normalize.css";
import "../scss/main.scss";

import "bootstrap/dist/js/bootstrap.bundle.min";
// import "./Animator";
// import "./ContactOverlay";
// import "./MaterialInput";
// import Particles from "./Particles";

import PubSub from "pubsub-js";
import Hamburger from "./Hamburger";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import "./Pagination";
import "./Background";
import "./MainOverlay";
import "./GreetingsAnimations";
import "./BackgroundAudio";
import "./AudioButton";
// new Particles("particles");
// $(".material-input").materialInput();

$("[data-toggle=\"tooltip\"]").tooltip();

PubSub.publish("pageLoaded");

const hamburger = new Hamburger(".hamburger");
const sidebar = new Sidebar(".sidebar");
const mainContent = new MainContent(".main");

PubSub.publish("openSidebar");

hamburger.on("open", function () {
  PubSub.publish("openSidebar");
}).on("close", function () {
  PubSub.publish("closeSidebar");
});

// PubSub.subscribe("swipeRight", function () {
//   PubSub.publish("openSidebar");
// });

$(".main").on("mousewheel", function (event) {
  if (event.deltaY < 0)
  {
    PubSub.publish("scrollDown");
  }
  else
  {
    PubSub.publish("scrollUp");
  }
});

$(window).on("resize", function () {
  PubSub.publish("windowResize", {
    width: window.innerWidth,
    height: window.innerHeight
  });
});

$(window).on("orientationchange", function () {
  PubSub.publish("windowResize", {
    width: window.innerHeight,
    height: window.innerWidth
  });
});