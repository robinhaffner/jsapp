define(function (require) {

    "use strict";

    var getSideBar = function (id) {
            var deferred = $.Deferred(),
                sidebarcontent = null,
                l = sidebar.length;
            for (var i = 0; i < l; i++) {
                if (sidebar[i].id === id) {
                    sidebarcontent = sidebar[i];
                    break;
                }
            }
            deferred.resolve(sidebarcontent);
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

        pagetitle = {
            "main":"Mobile CME - Index",
            "instructions": "Mobile CME - Instructions",
            "faculty": "Mobile CME - Faculty",
            "overview": "Mobile CME - Overview",
            "question": "Mobile CME - Question",
            "chart": "Mobile CME - Chart",
            "table": "Mobile CME - Table",
            "chart2": "Mobile CME - Second Chart",
            "video": "Mobile CME - Video",
            "question2": "Mobile CME - Second Question",
            "incorrect": "Mobile CME - Question Incorrect",
            "correct": "Mobile CME - Question Correct",
            "scale": "Mobile CME - Scale"
        },
        topnav = {
            "next-control": "Next",
            "headline": "<p>Virtual Patient Encounters: Improving Outcomes in CRC Patients</p>"
        },
        footer = [{
            "col-1": {
                "txt": "Privacy",
                "link": "tpl/privacy.html"
            },
            "col-2": {
                "txt": "Feedback",
                "link": "tpl/feedback.html"
            },
            "col-3": {
                "txt": "Get Certificate&nbsp;&#62;",
                "link": "#getcertificate"
            }
        }],
        sidebar = [
            {
                "name": "Company Name",
                "logo": "images/fpo/company-logo.png",
                "header": "Company Header",
                "headline": "Virtual Outcomes in CRC Patients",
                "sidebarlist": [
                    {
                        "media": 1,
                        "media-url": "https://www.google.ca/",
                        "media-img": "images/fpo/fpo-img-1.jpg",
                        "media-heading": "Media heading 1",
                        "media-subtext": "<p>This is subtext</p>"
                    },
                    {
                        "media": 2,
                        "media-url": "#faculty",
                        "media-img": "images/fpo/fpo-img-2.jpg",
                        "media-heading": "Media heading 2",
                        "media-subtext": "<p>This is subtext for second media</p>"
                    },
                    {
                        "media": 3,
                        "media-url": "https://www.google.ca/",
                        "media-img": "images/fpo/fpo-img-1.jpg",
                        "media-heading": "Media heading 3",
                        "media-subtext": "<p>This is subtext for third media</p>"
                    }
                ]
            }
        ],
        sitecontent = [
            {   "id": "main",
                "template": "Main",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients",
                "header": "Select your Specialty",
                "listviewer": [
                    "Colorectal Surgeon",
                    "Oncologist",
                    "Non-smoker",
                    "Other Healthcare Professional Interested in CRC"
                ],
                "audio_url": "audio/long-canada_anthem.mp3",
                "audio_autoplay": "0"
            },
            {   "id": "instructions",
                "template": "Instructions",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients"
            },
             {   "id": "faculty",
                "template": "Faculty",
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
            {   "id": "chart",
                "template": "Chart",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients",
                "header": "It is likely that Grace has oxaiplatin-induced sensory neurotoxicity. What would you try first in the hopes of alleviating Grace's neuropathy?",
                "questions": [
                  {
                    "percent": "17",
                    "question": "<p>Pellentesque risus diam, vulputate at mattis in; pellentesque.</p>"
                  },
                  {
                    "percent": "20",
                    "question": "<p>Proin quis malesuada turpis. Proin varius placerat dolor.</p>"
                  },
                  {
                    "percent": "80",
                    "question": "<p>Pellentesque a elit orci. Curabitur laoreet mollis sapien.</p>"
                  },
                  {
                    "percent": "4",
                    "question": "<p>Aenean quis orci nisi. Quisque quam diam, adipiscing vel ligula.</p>"
                  }
                ]
            },
            {   "id": "table",
                "template": "Table",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients",
                "header": "MOSAIC Trial",
                "details": "<p>Patients with stage II or III CRC underwent curative resection followed by 12 cycles of LV5FU2 or FOLFOX4</p><p>Patients followed every 2 weeks for the first 6 mos; then every 6 mos for 6 years</p><p>Results showed a benefit of adjuvant FOLFOX4 (ie, addition of oxaliplatin) in stage III CRC in terms of both OS and DFS</p>",
                "enlargetable": "images/fpo/fpo-table-1.jpg"
            },
            {   "id": "chart2",
                "template": "Chart2",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients",
                "header": "TML",
                "details": "<p>Purpose: Assess continued use of bevacizumab + 2nd line chemotherapy in patients with mCRC and who had progressed after 1st-line bevacizumab-based treatment</p><p>Second-line chemotherapy = Oxaliplatin- or Irinotecan-based (switch cemo) with or without bevacizumab (2.5mg/kg/week)</p>",
                "enlargetable": "images/fpo/fpo-chart-1.jpg"
            },
            {   "id": "video",
                "template": "Video",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients",
                "header": "Video",
                "details": "<p>A PET scan was conducted as followup after 3 years and revealed lymph node involvement. This video shows the results of that PET scan. Note the third and fourth axial lymph nodes.</p>",
                "popupVideo": "images/fpo/fpo-video-1.jpg",
                "poster": "images/fpo/fpo-video-1.jpg",
                "media": [
                  {
                    "mediatype": "video/mp4;codecs='avc1.42E01E, mp4a.40.2'",
                    "mediavideo": "video/mov_bbb.mp4"
                  },
                  {
                    "mediatype": "video/ogg",
                    "mediavideo": "video/mov_bbb.mp4"
                  }
                ]
            },       
            {   "id": "question2",
                "template": "Question2",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients",
                "header": "What grade of sensory neuropathy is Grace experiencing? <strong>Choose one.",
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
            {   "id": "playagain",
                "template": "Playagain",
                "headline": "Virtual Patient Encounters: Improving Outcomes in CRC Patients",
                "header": "Play again",
            }

        ];

    // The public API
    return {
        getSideBar: getSideBar,
        getTitle: getTitle,
        getTopNav: getTopNav,
        getFooter: getFooter,
        getContent: getContent
    };

}());
