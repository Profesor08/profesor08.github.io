import SplitLetters from "./SplitLetters";
import {TimelineMax} from "gsap";
import CustomEase from "./CustomEase";
import Rubber from "./RubberAnimation";

(function () {

  SplitLetters(".greetings .sub-title", "<span class=\"word\">$</span>", " ", " ");
  SplitLetters(".greetings .title", "<div class=\"line\">$</div>", /\n+/, "");
  SplitLetters(".greetings .title", "<span class=\"letter\">$</span>", "", "");

  let $letters = $(".greetings .letter");
  let $words = $(".greetings .word");
  let $lines = $(".greetings .line, .greetings .sub-title");
  let tl = new TimelineMax({
    onComplete: function () {
      randomRubber();
    }
  });

  function randomRubber()
  {
    for (let i = Math.random() * 5; i > 0; i--)
    {
      let letter = $letters[Math.floor(Math.random() * $letters.length)];

      Rubber.Letter(letter);
    }

    setTimeout(function () {
      randomRubber();
    }, 1000 * 1.3);
  }

  tl.staggerFromTo($lines, 1, {
    opacity: 0,
    y: 100
  }, {
    opacity: 1,
    y: 0,
    ease: CustomEase.create("custom", "M0,0 C0.14,0 0.242,0.438 0.272,0.561 0.313,0.728 0.354,0.963 0.362,1 0.366,0.992 0.464,0.868 0.574,0.868 0.658,0.868 0.782,0.989 0.786,0.998 0.822,0.962 0.856,0.941 0.892,0.942 0.947,0.942 1,1 1,1"),
    onStart: function () {
      let $letters = $(this.target).find(".letter");

      new TimelineMax().staggerFromTo($letters, 1.3, {
        opacity: 0,
        scaleX: 1.25,
        scaleY: 0.75,
        color: "#f4511e"
      }, {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        color: "white",
        ease: Rubber.Easing,
        onComplete: function () {
          this.target.setAttribute("style", "");
        }
      }, 0.1, .2);
    }
  }, 0.4);

  $letters.on("mouseenter", function () {
    Rubber.Letter($(this));
  });

  $words.on("mouseenter", function () {
    Rubber.Word($(this));
  });

})();