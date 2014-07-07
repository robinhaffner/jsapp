define(function (require) {

    "use strict";

    var findById = function (id) {
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
        },
        getPage = function () {
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
        /*pages = [
            {   "id": 1,
                "sidebar-title": "Company Logo",
                "sidebar-header": "Company Logo",
                "headline": "Virtual Outcomes in CRC Patients",
                "sidebar-list": [
                    {
                        "media": 1,
                        "media-img": "images/fpo/fpo-img-1.jpg",
                        "media-heading": "Media heading 1",
                        "media-subtext": "This is subtext"
                    },
                    {
                        "media": 2,
                        "media-img": "images/fpo/fpo-img-2.jpg",
                        "media-heading": "Media heading 2",
                        "media-subtext": "This is subtext for second media"
                    },
                    {
                        "media": 3,
                        "media-img": "images/fpo/fpo-img-1.jpg",
                        "media-heading": "Media heading 3",
                        "media-subtext": "This is subtext for third media"
                    }
                ]
            }
        ];*/

    // The public API
    return {
        findById: findById,
        getPage: getPage
    };

}());