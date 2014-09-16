define(function (require) {

    "use strict";

    var $               = require('jquery'),
        Handlebars      = require('handlebars'),
        siteAdapter     = require('adapters/site'),
        questionHtml    = require('text!tpl/question.html'),

        questionTpl = Handlebars.compile(questionHtml);

        require('js/lib/vendor/jquery-ui.min.js'); //file plugin need to execute sortable funtion
        
        Handlebars.registerHelper('if_eq', function(a, b, opts) {
            if(a == b) // Or === depending on your needs
                return opts.fn(this);
            else
                if(opts == undefined){
                    var ret = "";

                    for(var i=0, j=a.length; i<j; i++) {
                        ret = ret + b.fn(a[i]);
                    }
                    return ret;
                }
                else {
                    return opts.inverse(this);
                }
        });
    return function () {

        this.initialize = function () {
            this.$el = $('.content-wrapper');
        };

        this.render = function (content) {
            this.$el.html(questionTpl(content));
            this.$el.data('template', '').data('template', 'questionstpl');
 

            var sortcontainer = $("ul.sortable").attr('id'); //find sortable ul id
            if (sortcontainer) {  this.sortableQueston(sortcontainer) }; //sortable jquery-ui function
     
            return this;
        };

        this.sortableQueston = function (container) {
            var sortObj = {}, listArr = [], sortedlistArr = [],plot1= [], plot2=[];
            $("#"+container)
                .sortable({
                    'containment': 'parent',
                    'opacity': 0.6,
                    create: function( event, ui ) {
						Cookies.set('sortResults',[]);
                        $(this).find('li').each(function(index, el) {
                            listArr.push([ $(el).text(), parseFloat( $(el).data( "avg" ) ) ]);
							//listArr.push( $(el).data("id"));
							plot1.push([index+1, $(el).text()]);
							plot2.push([parseFloat($(el).data( "avg" )), $(el).text()]);
                        });
                        sortObj["listArr"] = listArr;
                        $(this).data('sortJSON', sortObj);
						Cookies.set('sortResults',sortObj["listArr"]);
						Cookies.set("__plot1", plot1); 
						Cookies.set("__plot2", plot2); 
                    },
                    update: function(event, ui) {
						var sortedlistArr = [],plot1= [], plot2=[];
                        $(this).find('li').each(function(index, el) {
                            sortedlistArr.push([ $(el).text(), parseFloat( $(el).data( "avg" ) ) ]);
							plot1.push([index+1, $(el).text()]);
							plot2.push([parseFloat($(el).data( "avg" )), $(el).text()]);
                        });
                        sortObj["sortedlistArr"] = sortedlistArr;
						console.log(sortObj["sortedlistArr"]);
						Cookies.set('sortResults',sortObj["sortedlistArr"]);

						plot1.reverse();
						plot2.reverse();
	
						Cookies.set("__plot1", plot1); 
						Cookies.set("__plot2", plot2); 
						console.log(plot1, plot2);

                    }
                })
                .disableSelection();
        }

        this.initialize();

    };

});
