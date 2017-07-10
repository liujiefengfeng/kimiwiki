requirejs.config({
    "baseUrl": "scripts"
});
requirejs(["render",
    "alert",
    "direct",
    "zepto",
    "lodash"],
    function (render, alert, direct, $, _) {
    $(function () {
        alert.showLoading();
        if (location.hash) {
            render(location.hash);
        } else {
            render("#README");
        }
    })
    $(window).on("hashchange", function (e) {
        alert.showLoading();
        if (location.hash) {
            render(location.hash);
        } else {
            render("#README");
        }

        e.preventDefault();
    });

    $("#btn-search").click(function (e) {
        e.preventDefault();
        var search_term = $("#input-search").val();
        if (search_term == null || search_term === undefined || search_term.length == 0) {
            return;
        }

        location.hash = "#search/" + search_term;
    });

    $("#short-link").click(function (e) {
        e.preventDefault();
        if (/^#(w|d|search)\//.test(location.hash)) {
            return;
        }

        location.hash = "#d/" + location.hash.replace(/^#/, "");
    })
});