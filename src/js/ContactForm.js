import axios from "axios/dist/axios.min"
import Noty from "noty";
import "noty/src/noty.scss";
import "noty/src/themes/nest.scss"

(function () {
  let $form = $(".contact-form form");

  $form.on("submit", function (event) {
    event.preventDefault();
    let data = new FormData(this);

    console.log(this);
    console.log(data.get("name"));

    axios.post("https://e-webdev.ru/landing-mailer/", data).then(function (res) {
      let data = res.data;

      if (data.status !== undefined && data.message !== undefined)
      {
        new Noty({
          type: data.status,
          text: data.message,
          theme: "nest",
          killer: true,
          timeout: 3000,
          closeWith: ['click']
        }).show();
      }
      else
      {

      }

    });
  });


})();