requirejs.config({
    "baseUrl": "scripts"
});
requirejs(["render", "zepto"], function (render, $) {
    $(function () {
        if (location.hash) {
            render(location.hash);
        } else {
            render("#README");
        }
    })
    $(window).on("hashchange", function (e) {
        render(location.hash);
        e.preventDefault();
    });
});