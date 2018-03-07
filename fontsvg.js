const TextToSVG = require('text-to-svg');
const fs = require('fs');

let fonts = [
  "src/fonts/google-fonts/ofl/courgette/Courgette-Regular.ttf",
  "src/fonts/google-fonts/ofl/tangerine/Tangerine-Regular.ttf"
];

TextToSVG.load(fonts[1], function (err, textToSVG) {
  const attributes = {};
  const options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes};
  let svg = textToSVG.getSVG("e-WebDev", options);

  fs.writeFile("src/images/icons/logo.svg", svg, function(err) {
    if(err) {
      return console.log(err);
    }
  });
});