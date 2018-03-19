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