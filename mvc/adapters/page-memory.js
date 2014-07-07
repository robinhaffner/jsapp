define(function (require) {

    "use strict";

    /*var findById = function (id) {
            var deferred = $.Deferred(),
                page = null,
                l = pages.length;
            for (var i = 0; i < l; i++) {
                if (pages[i].id === id) {
                    page = pages[i];
                    break;
                }
            }
            deferred.resolve(page);
            return deferred.promise();
        },*/
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
            "question2",
            "incorrect",
            "correct",
            "scale"
        ];

    // The public API
    return {
        //findById: findById,
        getPage: getPage
    };

}());