/**
 * Created by Profesor08 on 25.07.2017.
 */


function floatingMenu(selector)
{
  const menuContainer = document.querySelector(selector);

  document.addEventListener("scroll", function ()
  {
    if (this.body.scrollTop > 38)
    {
      if (!menuContainer.classList.contains("floating"))
      {
        menuContainer.classList.add("floating")
      }
    }
    else
    {
      if (menuContainer.classList.contains("floating"))
      {
        menuContainer.classList.remove("floating")
      }
    }
  });
}

function nowDate()
{
  const element = document.querySelector("#now-date");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  if (element)
  {
    let date = new Date();
    element.innerText = date.getUTCDay() + " " + monthNames[date.getUTCMonth()];
  }
}

nowDate();

$(".button-collapse").dropdown({
  constrainWidth: false
});


$('.scrollspy').scrollSpy({
  getActiveElement: function (id)
  {
    if (id === "home")
    {
      $(".header").addClass("elite");
    }
    else
    {
      $(".header").removeClass("elite");
    }

    return "a[href=\"#" + id + "\"]";
  }
});

$('.materialboxed').materialbox();

floatingMenu(".header");

document.querySelector("#contact-form").addEventListener("submit", function (event)
{
  event.preventDefault();

  const data = new FormData(this);

  axios.get("./", {
    params: {
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message")
    }
  }).then(() =>
  {
    this.reset();
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
      // "type": ["polygon", "circle", "edge", "triangle"],
      "type": ["circle"],
      "stroke": {
        "width": 0,
        "color": "#FFFFFF"
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
      // "value": 10,
      "value": 5,
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