(function ($) {

  $.fn.materialInput = function () {
    this.each(function () {
      let _this = $(this);
      let activeClass = "is-active";
      let $inputs = _this.find("input, textarea");

      $inputs.on("focus", function () {
        _this.addClass(activeClass);
      });

      $inputs.on("blur", function () {
        if ($(this).val().length === 0)
        {
          _this.removeClass(activeClass);
        }
      });

      $inputs.each(function () {
        if ($(this).val().length > 0)
        {
          _this.addClass(activeClass);
        }
      });
    });
  }

})(jQuery);