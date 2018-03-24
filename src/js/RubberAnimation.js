import {TimelineMax} from "gsap";

export default {
  Letter: function(letter) {
    let tl = new TimelineMax();
    
    tl.to(letter, .3, {
      scaleX: 1.25,
      scaleY: 0.75
    });

    tl.to(letter, 1, {
      scaleX: 1,
      scaleY: 1,
      ease: Elastic.easeOut.config(3, 0.3)
    });
  },
  
  Word: function (word) {
    let tl = new TimelineMax();

    tl.to(word, .3, {
      scaleX: 1.1,
      scaleY: 0.75
    });

    tl.to(word, 1, {
      scaleX: 1,
      scaleY: 1,
      ease: Elastic.easeOut.config(3, 0.3)
    });
  },

  Easing: Elastic.easeOut.config(3, 0.3)
};