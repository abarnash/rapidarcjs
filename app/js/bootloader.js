/**
@win
@doc
*/

(function() {
    'use strict';
    var baseUrl;
    /* if app files in different location, hardcode the path, USE SLASH AT END OF URL*/
    // baseUrl = "http://shj.blueraster.com/apps-wiseguy/template-esri/src/";

    var pathPrefix = baseUrl || document.location.pathname.replace(/\/[^/]+$/, "");
    if (pathPrefix.slice(-1) !== "/") {
        pathPrefix = pathPrefix + "/";
    }



    var esriVersion = "3.13",
        loadFiles = {
            "css": [
                pathPrefix + "css/app.css",
                "http://js.arcgis.com/" + esriVersion + "/esri/css/esri.css",
                "http://js.arcgis.com/" + esriVersion + "/dijit/themes/tundra/tundra.css"
            ],
            "js": [
                // "http://code.highcharts.com/adapters/standalone-framework.js",
                "http://js.arcgis.com/" + esriVersion + "/",
                pathPrefix + "js/lodash.js"
            ]

        },
        version = "0.1",
        dojoConfig;

    //baseUrl = "http://bur/projs/iclus/src";


    //"http://shj.blueraster.com/apps-wiseguy/template-esri/src";
    //baseUrl = "http://shj.blueraster.com/apps-git/2339-epa-iclus.optimusprime/src";

    var pathPrefix = baseUrl || document.location.pathname.replace(/\/[^/]+$/, "");

    // Precaution
    if (!window.console) {
        window.console = {
            log: function() {},
            debug: function() {}
        };
    }

    // dojoConfig definition
    dojoConfig = {
        hashPollFrequency: 50,
        parseOnLoad: false,
        isDebug: false,
        async: true,
        //cacheBust: "v=" + version,
        packages: [{
            name: "app",
            location: pathPrefix + "/js"
        }],
        aliases: [ //use for version specific files
        ],
        deps: [
            "app/startup"
        ],
        callback: function() {


        } // End callback
    };

    window.dojoConfig = dojoConfig;

    var loadScript = function(src, attrs) {
        var s = document.createElement('script');
        s.setAttribute('src', src);
        // s.setAttribute('async', false);
        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                s.setAttribute(key, attrs[key]);
            }
        }
        document.getElementsByTagName('head')[0].appendChild(s);
    };

    var loadStyle = function(src) {
        var l = document.createElement('link');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('type', 'text/css');
        l.setAttribute('href', src);
        document.getElementsByTagName('head')[0].appendChild(l);
    };

    var loadConfiguration = function() {
        console.log("loadConfiguration");
        //load css
        for (var k = 0; k < loadFiles.css.length; k += 1) {
            loadStyle(loadFiles.css[k]);
        }
        //load js
        for (var i = 0; i < loadFiles.js.length; i += 1) {
            loadScript(loadFiles.js[i]);
        }

    };

    if (document.readyState === "loaded") {
        loadConfiguration();
    } else {
        window.onload = loadConfiguration;
    }

})();