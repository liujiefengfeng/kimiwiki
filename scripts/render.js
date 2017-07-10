define(["./zepto", "./marked", "./alert", "./search"], function ($, marked, alert, search) {
    
    function render(hash, isDir) {

        if (hash.indexOf("#search") == 0) {
            search_term = hash.replace("#search/", "");
            return search.search(decodeURIComponent(search_term));
        }

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
                } else {
                    alert.showAlert();
                }
            }
        });
    };

    render.render = render;

    return render;
});