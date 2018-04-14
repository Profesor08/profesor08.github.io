export default (function () {

  window.tickerCallbacksArray = [];

  function tick() {
    window.requestAnimationFrame(tick);

    window.tickerCallbacksArray.forEach(function (callback) {
      if (callback instanceof Function) {
        callback();
      }
    });
  }

  function add(callback)
  {
    if (callback instanceof Function) {
      window.tickerCallbacksArray.push(callback);
    }
  }

  tick();

  return {
    add: add
  };
})();