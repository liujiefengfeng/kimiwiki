define(["./zepto"], function ($) {
    $.fn.center = function () {
        this.css("position", "fixed").css("z-index", "5000")
            .css("top", "50%").css("left", "50%")
            .css("margin", (-(this.height() / 2)) + "px 0 0 " + (-(this.width() / 2)) + "px");
        return this;
    };

    function showAlert() {
        $("#error").html("<b>Error:</b> under construction");
        $("#error").show();
        $("#error").center();

        setTimeout(function() {
            $("#error").hide();
            history.back();
        }, 1000);
    }

    return {
        showAlert: showAlert
    }

});