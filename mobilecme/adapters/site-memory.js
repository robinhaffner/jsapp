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

        getContent = function(id) {
          console.log("getContent",id);
          var deferred = $.Deferred(),
              content = null,
              l = sitecontent.length;
          for (var i = 0; i < l; i++) {
              if (sitecontent[i].id === id) {
                  content = sitecontent[i];
                  console.log("content",content);
                  break;
              }
          }
          return content;
          deferred.resolve(content);
          return deferred.promise();
        },
         getFaculty = function () {
            var deferred = $.Deferred();
            deferred.resolve(faculty);
            return deferred.promise();
        },
         getOverview = function () {
            var deferred = $.Deferred();
            deferred.resolve(overview);
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
        ],
        sitecontent = [
            {   "id": "instructions",
                "template": "Instructions",
                "title": "Mobile CME",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients"
            },
             {   "id": "faculty",
                "template": "Faculty",
                "title": "Mobile CME",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients",
                "header": "Presenting Faculty",
                "faculty": [
                   {
                      "faculty_name": "Cynthia M. Bulik, PhD, FAED",
                      "faculty_thumbnail":"images/fpo/fpo-img-1.jpg",
                      "faculty_titles": [
                        {"title": "Distinguished Professor of Eating Disorders, Department of Psychiatry; Professor of Nutrition, Gillings School of Public Health; Director, UNC Center of Excellence for Eating Disorders; Co-Director, UNC Center for Psychiatric Genomics, University of North Carolina at Chapel Hill, Chapel Hill, North Carolina"}
                      ],
                      "faculty_descript": "Phasellus sit amet orci non erat venenatis tempor quis in tellus. Phasellus semper tincidunt odio, sed facilisis erat tincidunt et.",
                      "sequence": 1
                    },
                    {
                      "faculty_name": "Susan L. McElroy, MD",
                      "faculty_thumbnail":"images/fpo/fpo-img-1.jpg",
                      "faculty_titles": [
                        {"title": "Chief Research Officer, Lindner Center of HOPE; Professor of Psychiatry and Behavioral Neuroscience, University of Cincinnati College of Medicine, Mason, Ohio"}
                      ],
                      "faculty_descript": "Phasellus sit amet orci non erat venenatis tempor quis in tellus. Phasellus semper tincidunt odio, sed facilisis erat tincidunt et.",
                      "sequence": 2
                    },
                    {
                      "faculty_name": "Chevese Turner",
                      "faculty_thumbnail":"images/fpo/fpo-img-1.jpg",
                      "faculty_titles": 
                      [
                        {"title": "President and CEO, Binge Eating Disorder Association, Severna Park, Maryland"}
                      ],
                      "faculty_descript": "Phasellus sit amet orci non erat venenatis tempor quis in tellus. Phasellus semper tincidunt odio, sed facilisis erat tincidunt et.",
                      "sequence": 3
                    }
                ]
             },
            {   "id": "overview",
                "template": "Overview",
                "title": "Mobile CME - overview",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients",
                "header": "Grace: Overview",
                "subheader": "<p>70-year old Caucasian female</p><p><strong>Patient History</strong></p>",
                "img": "images/fpo/fpo-img-2.jpg",
                "listviewer": [
                    "Married, two stepchildren",
                    "Works part-time in retail clothing store",
                    "Non-smoker",
                    "Blood pressure controlled with medication",
                    "Diagnosed with stage IIIa CRC, 3 mos ago",
                    "Hemicolectomy performed (successful, no complicantions)"
                ]
            },       
            {   "id": "question",
                "template": "Question",
                "title": "Mobile CME - Question",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients",
                "header": "What grade of sensory neuropathy is Grace experiencing? <strong>Choose one.</strong>",
                "questions": [
                  {
                    "questionprecent": "17",
                    "questiontxt": "<p>Pellentesque risus diam, vulputate at mattis in; pellentesque.</p>"
                  },
                  {
                    "questionprecent": "20",
                    "questiontxt": "<p>Mauris ullamcorper justo vel massa.</p>"
                  },
                  {
                    "questionprecent": "80",
                    "questiontxt": "<p>Quisque eget dui augue. Class.</p>"
                  },
                  {
                    "questionprecent": "4",
                    "questiontxt": "<p>Duis nibh nisl, cursus at.</p>"
                  }
                ]
            },
        ];

    // The public API
    return {
        getSideBar: getSideBar,
        getTitle: getTitle,
        getTopNav: getTopNav,
        getFooter: getFooter,
        getContent: getContent,
        getFaculty: getFaculty,
        getOverview: getOverview
    };

}());
