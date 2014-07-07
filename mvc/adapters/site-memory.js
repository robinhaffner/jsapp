define(function (require) {

    "use strict";

    var getSideBar = function (id) {
            var deferred = $.Deferred(),
                sidecontent = null,
                l = sidebar.length;
            for (var i = 0; i < l; i++) {
                if (sidebar[i].id === id) {
                    sidecontent = sidecontent[i];
                    break;
                }
            }
            deferred.resolve(sidecontent);
            return deferred.promise();
        },
        getTitle = function (_hash) {
            var deferred = $.Deferred();
            var getHash;
            for(var key in pagetitle) {
                if(key === _hash){
                   getHash = pagetitle[key];
                }
            }
            deferred.resolve(getHash);
            return deferred.promise();
        },
        getTopNav = function () {
            var deferred = $.Deferred();
            deferred.resolve(topnav);
            return deferred.promise();
        },

        getFooter = function (id) {
            var deferred = $.Deferred(),
                ftr = null,
                l = footer.length;
            for (var i = 0; i < l; i++) {
                if (footer[i].id === id) {
                    ftr = footer[i];
                    break;
                }
            }
            deferred.resolve(ftr);
            return deferred.promise();
        },

        pagetitle = {
            "index":"Mobile CME - Index",
            "instructions": "Mobile CME - Instructions"
        },
        topnav = {
            "next-control": "Next",
            "headline": "<p>Virtual Patient Encounters: Improving Outcomes in CRC Patients</p>"
        },
        footer = [{
            "col-1": {
                "txt": "Privacy",
                "link": "#privacy"
            },
            "col-2": {
                "txt": "Feedback",
                "link": "#feedback"
            },
            "col-3": {
                "txt": "Get Certificate&nbsp;&#62;",
                "link": "#getcertificate"
            }
        }],
        sidebar = [
            {   
                "sidebar-title": "Company Name",
                "sidebar-logo": "images/fpo/company-logo.png",
                "sidebar-header": "Company Header",
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
        ];
        /*sitecontent = [
            {   "id": 1,
                "title": "Mobile CME",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients",
                "header": "Select your Specialty",
                "listviewer": [
                    "Colorectal Surgeon",
                    "Oncologist",
                    "Other Healthcare Professional Interested in CRC"
                ]
            }
        ]*/

    // The public API
    return {
        getSideBar: getSideBar,
        getTitle: getTitle,
        getTopNav: getTopNav,
        getFooter: getFooter
    };

}());