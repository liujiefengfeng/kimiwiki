define([
    './zepto',
    './lodash'
], function ($, _) {

    var tplLink = _.template("<a href='<%= href %>'><%= href %></a>");

    var direct = function (hash) {
        var direct_key = hash.replace("#w/", "");
        return $.get("/hashing.json", function (data) {
            data = _.isString(data) ? JSON.parse(data) : data

            if (data[direct_key] === undefined) {
                $("#content").html("<h4>No content found.</h4>" +
                    "<a href='#README'>Go back to Home</a>");
            } else {
                location.hash = "#" + data[direct_key];
            }
        });
    }

    var shortLink = function (hash) {
        var item = decodeURIComponent(hash.replace("#d/", ""));
        if (item === undefined || item === "") {
            return;
        }
        return $.get("/hashing.json", function (data) {
            data = _.isString(data) ? JSON.parse(data) : data

            if (data["reversed"][item] === undefined) {
                item += "/README"
            }

            if (data['reversed'][item] !== undefined) {
                $("#content").html(tplLink({ href: "http://" + location.host + "/#w/" + data['reversed'][item] }));
            } else {
                $("#content").html("<h4>No content found.</h4>" +
                    "<a href='#README'>Go back to Home</a>")
            }
        });
    }

    return {
        direct: direct,
        shortLink: shortLink
    }
});