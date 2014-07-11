define(function (require) {

    "use strict";

        var getPage = function () {
            var deferred = $.Deferred();
            deferred.resolve(pages);
            return deferred.promise();
        },

        pages = [
            "index",
            "instructions",
            "faculty",
            "overview",
            "question",
            "chart",
            "table",
            "chart2",
            "video",
            "question2"
            //"incorrect",
            //"correct",
            //"scale"
        ];

    // The public API
    return {
        getPage: getPage
    };

}());