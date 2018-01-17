define(["./zepto",
    "./lodash",
    "./marked",
    "./alert",
    "./search",
    "./direct"],
    function ($, _, marked, alert, search, direct) {

    var tplNavInside = _.template("<li><a href='<%= href %>'><%= name %></a></li>")
    var tplNavLast = _.template("<li class='active'><%= name %></li>")

    var isHome = function (seg) {
        return seg == "README" || seg.length === 0;
    }

    var buildBreadCrumb = function (hash) {
        var segments = hash.split("/");

        if (segments.length === 0 || isHome(segments[0])) {
            return '<li class="active">Home</li>';
        }

        var segment = segments[0];
        var breads = [];
        href = "#"
        var i = 0;
        while (segment != "README") {
            href += (href === "#" ? segment : "/" + segment)
            breads.push({ href: href, name: decodeURIComponent(segment), template: tplNavInside });
            i++;
            if (i >= segments.length) break;
            segment = segments[i];
        }
        breads.unshift({ href: "#README", name: "Home", template: tplNavInside });
        _.last(breads).template = tplNavLast;

        return breads.reduce(function (text, it) {
            return text + it.template(it);
        }, "");
    }

    var render = function (hash, isDir) {

        if (hash.indexOf("#search") == 0) {
            search_term = hash.replace("#search/", "");
            return search.search(decodeURIComponent(search_term));
        }

        if (hash.indexOf("#w/") == 0) {
            return direct.direct(hash);
        }

        if (hash.indexOf("#d/") == 0) {
            return direct.shortLink(hash);
        }

        isDir = !(typeof (isDir) === "undefined") && isDir;
        var url = hash.replace(/^#/, "/cnmd/") + ".cn.md";

        $.ajax({
            url: url,
            timeout: 5000,
            success: function (data) {
                alert.hide();
                $("#nav").html(buildBreadCrumb(hash.replace(/^#/, "")));
                $("#content").html(marked(data));
                $("#edit-page").attr("href", "https://github.com/liujiefengfeng/wiki/edit/gh-pages" + url);
            },

            error: function (data, status, err) {
                if (!isDir) {
                    render(hash + "/README", true);
                } else {
                    if (isDir) {
                        alert.showAlert("<b>Error:</b> under construction");
                        setTimeout(function () {
                            history.back(-2);
                        }, 1000);
                    }
                }
            }
        });
    };

    render.render = render;

    return render;
});
