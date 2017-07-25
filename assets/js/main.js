/**
 * Created by Profesor08 on 28.05.2016.
 */

(function ()
{

  "use strict";

  var menu = document.querySelector(".floating-menu");
  var scrollButton = document.querySelector(".scrollTop");
  var menuToggle = document.querySelector(".menuToggle");
  var navMenu = document.querySelector(".floating-menu nav.menu");
  var navMenuItems = document.querySelectorAll(".floating-menu nav.menu a");

  var checkMenu = function ()
  {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;

    if (scrolled > 100)
    {
      if (!menu.classList.contains("compact"))
      {
        menu.classList.add("compact");
      }
    }
    else
    {
      if (menu.classList.contains("compact"))
      {
        menu.classList.remove("compact");
      }
    }
  };

  var checkScrollButton = function ()
  {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;

    if (scrolled > window.innerHeight / 2)
    {
      if (!scrollButton.classList.contains("show"))
      {
        scrollButton.classList.add("show");
        setTimeout(function ()
        {
          if (scrollButton.classList.contains("show"))
          {
            scrollButton.classList.add("animate");
          }
        }, 100);
      }
    }
    else
    {
      if (scrollButton.classList.contains("show"))
      {
        scrollButton.classList.remove("animate");
        setTimeout(function ()
        {
          if (!scrollButton.classList.contains("animate"))
          {
            scrollButton.classList.remove("show");
          }
        }, 500);
      }
    }
  };

  checkMenu();
  checkScrollButton();

  window.addEventListener("scroll", function (e)
  {
    checkMenu();
    checkScrollButton();
  });

  menuToggle.addEventListener("click", function ()
  {
    if (!menuToggle.classList.contains("active"))
    {
      menuToggle.classList.add("active");
      navMenu.classList.add("active");
    }
    else
    {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });

  [].forEach.call(navMenuItems, function(e)
  {
    e.addEventListener("click", function ()
    {
      [].forEach.call(navMenuItems, function(e)
      {
        if (e.classList.contains("active"))
        {
          e.classList.remove("active")
        }
      });

      if (navMenu.classList.contains("active"))
      {
        this.classList.add("active");
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  });



  $(function ()
  {
    $('a[href*="#"]:not([href="#"])').click(function ()
    {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname)
      {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length)
        {
          $('html, body').stop().animate({
            scrollTop: target.offset().top
          }, 500);
          return false;
        }
      }
    });
  });

  particlesJS("particles", {
    "particles": {
      "number": {
        "value": 30,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {"value": "#ffffff"},
      "shape": {
        "type": ["polygon", "circle", "edge", "triangle"],
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {"nb_sides": 5},
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.1,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 10,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 300,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "repulse"
        },
        "onclick": {
          "enable": false,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {"opacity": 1}
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {"particles_nb": 4},
        "remove": {"particles_nb": 2}
      }
    },
    "retina_detect": true
  });

})();


