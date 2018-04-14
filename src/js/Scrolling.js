import PubSub from "pubsub-js";
import Hammer from "hammerjs";

(function () {

  function addWheepSwipe(element, type, upCallback, downCallback) {

    const hammer = new Hammer(element, {
      touchAction : 'auto'
    });

    hammer.get(type).set({
      direction: Hammer.DIRECTION_ALL
    });

    hammer.on(type + "up", function (e) {
      if (upCallback instanceof Function) {
        upCallback(e);
      }
    });

    hammer.on(type + "down", function (e) {
      if (downCallback instanceof Function) {
        downCallback(e);
      }
    });

    element.addEventListener("mousewheel", function (e) {
      if (event.deltaY > 0) {
        if (upCallback instanceof Function) {
          upCallback(e);
        }
      }
      else {
        if (downCallback instanceof Function) {
          downCallback(e);
        }
      }
    })
  }

  // Home screen scrolling actions
  const home = document.querySelector(".home");

  addWheepSwipe(home, "swipe", function() {
    PubSub.publish("gotoPage", {
      to: "works",
      direction: -1
    });
  }, function() {
    PubSub.publish("gotoPage", {
      to: "contact",
      direction: 1
    });
  });


  // Contact screen scrolling actions
  const works = document.querySelector(".works");
  const worksList = works.querySelector(".works-list");

  addWheepSwipe(works, "pan", function() {
    if (worksList !== null && (worksList.scrollHeight - worksList.clientHeight === worksList.scrollTop)) {
      PubSub.publish("gotoPage", {
        to: "contact",
        direction: -1
      });
    }
  }, function() {
    if (worksList !== null && worksList.scrollTop === 0) {
      PubSub.publish("gotoPage", {
        to: "home",
        direction: 1
      });
    }
  });


  // Contact screen scrolling actions
  const contact = document.querySelector(".contact");
  const contactForm = contact.querySelector(".contact-form");

  addWheepSwipe(contact, "pan", function() {
    if (contactForm !== null && (contactForm.scrollHeight - contactForm.clientHeight === contactForm.scrollTop)) {
      PubSub.publish("gotoPage", {
        to: "home",
        direction: -1
      });
    }
  }, function() {
    if (contactForm !== null && contactForm.scrollTop === 0) {
      PubSub.publish("gotoPage", {
        to: "works",
        direction: 1
      });
    }
  });


})();