define(["./zepto", "./lodash"], function ($, _) {

    var tplResultList = _.template("<ul><%= resultList %></ul>");
    var tplResultLink = _.template("<li><a href='/#<%= item %>'><%= item %></a></li>");
    var tplHightLightTerm = _.template("<u><%= term %></u>");
    var tplResultTerm = _.template("<dt><%= matched_term %></dt><dd><%= result %></dd>");
    var tplSearchResult = _.template("<h3>Found:</h3><dl><%= results %></dl>");
    var tplNotFound = _.template("<h3>No result found</h3>" +
        "Sorry, cannot find any result with <b> <%- term %> </b>");

    var renderSubResult = function (result) {
        return tplResultList({
            resultList: result.map(function (item) {
                return tplResultLink({ item: item });
            }).join("")
        });
    }

    var highlight = function (val, term) {
        return val.replace(term, tplHightLightTerm({ term: term }));
    }

    var renderSearchResult = function (results, search_term) {
        return tplSearchResult({
            results: results.map(function (pair) {
                return tplResultTerm({
                    matched_term: highlight(pair[0], search_term),
                    result: renderSubResult(pair[1])
                });
            }).join("")
        });
    }

    var matches = function (key, term, strict_mode) {
        return strict_mode ? key.indexOf(term.substring(1)) == 0 :
            key.indexOf(term) >= 0
    };

    var renderNotfound = function (search_term) {
        return tplNotFound({ term: search_term });
    }

    function search(search_term) {
        var strict_mode = false;
        if (search_term[0] === '+') {
            strict_mode = true;
        }
        $.get("/indexing.json", function (data) {
            var results = _.entries(_.isString(data) ? JSON.parse(data) : data).filter(function (key) {
                return matches(key[0], search_term, strict_mode);
            });
            if (results.length == 0) {
                $("#content").html(renderNotfound(search_term));
            } else {
                $("#content").html(renderSearchResult(results, search_term));
            }
        });

    }


    return {
        search: search
    }
});