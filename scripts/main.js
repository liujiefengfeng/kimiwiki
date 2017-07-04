requirejs.config({
    "baseUrl": "scripts"
});
requirejs(["render", "zepto", "lodash"], function (render, $, _) {
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

    var renderSubResult = function (result) {
        return "<ul>" + result.map(function (item) {
            return "<li><a href='/#" + item + "'>" + item + "</a></li>"
        }).join("") + "</ul>";
    }

    var highlight = function (val, term) {
        return val.replace(term, "<u>"+term+"</u>");
    }

    var renderSearchResult = function (results, search_term) {
        return "<dl>" + results.map(function (pair) {
            return "<dd>" + highlight(pair[0], search_term) + "</dd>" + "<dt>" + renderSubResult(pair[1]) + "</dt>"
        }).join("") + "</dl>";
    }

    $("#btn-search").click(function (e) {
        e.preventDefault();
        var search_term = $("#input-search").val();
        var strict_mode = false;
        if (search_term[0] === '+') {
            strict_mode = true;
        }
        $.get("/indexing.json", function (data) {
            var results = _.entries(_.isString(data) ? JSON.parse(data) : data).filter(function (key) {
                return strict_mode ? key[0].indexOf(search_term.substring(1)) == 0 :
                    key[0].indexOf(search_term) >= 0;
            });
            if (results.length == 0) {
                $("#content").html("<h3>No result found</h3>Sorry, cannot find any result with <b>" + search_term + "</b>");
            } else {
                $("#content").html(renderSearchResult(results, search_term));
            }
        });
    });
});