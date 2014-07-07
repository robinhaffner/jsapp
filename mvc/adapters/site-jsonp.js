define(function (require) {

    "use strict";

    var $ = require('jquery'),

        url = window.location.href,

        findById = function (id) {
            return $.ajax({url: url + "/" + id, dataType: "jsonp"});
        },

        findByName = function (searchKey) {
            return $.ajax({url: url + "?name=" + searchKey, dataType: "jsonp"});
        };

    // The public API
    return {
        findById: findById,
        findByName: findByName
    };

});