define(["./zepto", "./marked"], function ($, marked) {
    function render(hash, isDir) {
        isDir = !(typeof (isDir) === "undefined") && isDir;
        var url = hash.replace(/^#/, "/cnmd/") + ".cn.md";

        $.ajax({
            url: url,
            timeout: 5000,
            success: function (data) {
                $("#content").html(marked(data));
                $("#edit-page").attr("href", "https://github.com/kenpusney/kimiwiki/edit/gh-pages" + url);
            },

            error: function (data, status, err) {
                if (!isDir) {
                    render(hash + "/README", true);
                }
            }
        });
    };

    render.render = render;

    return render;
});