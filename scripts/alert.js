define(["./zepto"], function ($) {
    $.fn.center = function () {
        this.css("position", "fixed").css("z-index", "5000")
            .css("top", "50%").css("left", "50%")
            .css("margin", (-(this.height() / 2)) + "px 0 0 " + (-(this.width() / 2)) + "px");
        return this;
    };

    function showAlert(html) {
        $("#error").html(html);
        $("#error").show();
        $("#error").center();

        setTimeout(function() {
            $("#error").hide();
        }, 1000);
    }

    function showLoading() {
        showAlert("Loading...")
    }

    function hide() {
        $("#error").hide();
    }

    return {
        showAlert: showAlert,
        showLoading: showLoading,
        hide: hide
    }

});