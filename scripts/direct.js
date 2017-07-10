define([
    './zepto',
    './lodash'
], function ($, _) {
    var direct = function (hash) {
        var direct_key = hash.replace("#w/", "");
        return $.get("/hashing.json", function (data) {
            data = _.isString(data) ? JSON.parse(data) : data

            if (data[direct_key] === undefined) {
                $("#content").html("<h4>No content found.</h4>" +
                    "<a href='#README'>Go back</a>");
            } else {
                location.hash = "#" + data[direct_key];
            }
        });
    }

    return {
        direct: direct
    }
});