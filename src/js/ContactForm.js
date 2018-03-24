import axios from "axios/dist/axios.min"
import Noty from "noty";
import "noty/src/noty.scss";
import "noty/src/themes/nest.scss"
import SplitLetters from "./SplitLetters";
import Rubber from "./RubberAnimation";

(function () {

  SplitLetters(".contact-form .title", "<span class=\"letter\">$</span>", "", "");
  SplitLetters(".contact-form .sub-title", "<span class=\"word\">$</span>", " ", " ");

  let $letters = $(".contact-form .letter");
  let $words = $(".contact-form .word");
  let $button = $(".contact-form button");

  $letters.on("mouseenter", function () {
    Rubber.Letter(this);
  });

  $words.on("mouseenter", function () {
    Rubber.Word(this);
  });

  $button.on("mouseenter", function () {
    Rubber.Word(this);
  });

  let $form = $(".contact-form form");

  $form.on("submit", function (event) {
    event.preventDefault();
    let data = new FormData(this);

    function status(data)
    {
      switch (data.status)
      {
        case "error":
          return "error";
        case "success":
          return "success";
      }

      return "warning";
    }

    function message(data)
    {
      let msg = data.message ? data.message.trim() : "";

      if (!msg || msg.length === 0)
      {
        return "Something went wrong!";
      }

      return msg;
    }

    axios.post("https://e-webdev.ru/landing-mailer/", data).then(res => {
      new Noty({
        type: status(res.data),
        text: message(res.data),
        theme: "nest",
        killer: true,
        timeout: 3000,
        closeWith: ['click']
      }).show();

      if (res.data.status === "success") {
        this.reset();
      }
    });
  });


})();