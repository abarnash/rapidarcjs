(function() {
    require([
        // "app/riskController",
        "app/config",
        "app/esriLoader",

        "esri/map",
        "esri/layers/ArcGISImageServiceLayer",
        "esri/layers/ImageServiceParameters",
        "esri/layers/GraphicsLayer",
        "esri/geometry/Polygon",
        "esri/symbols/SimpleFillSymbol",
        "esri/graphic",
        "esri/layers/RasterFunction",
        "app/ko",
        // "app/loaderController",
        "esri/geometry/geometryEngine",
        "esri/layers/FeatureLayer",
        "esri/geometry/Point", 
        "esri/SpatialReference",
        "esri/toolbars/draw"
        // "app/testdata"
        ], 
    function(
        // riskController,
        config,
        esriLoader,
        Map,
        ArcGISImageServiceLayer,
        ImageServiceParameters,
        GraphicsLayer,
        Polygon,
        SimpleFillSymbol,
        Graphic,
        RasterFunction,
        ko,
        // Loader,
        geoEngine,
        FeatureLayer,
        Point,
        SpatialReference,
        Draw
        // testdata
    ) {
            

            var vm = {
            }

            config.corsEnabledServers.forEach(function(server){
                esriConfig.defaults.io.corsEnabledServers.push(server);
            });

            var map = new Map("mapDiv", config.defaultMapOptions);

            map.on("load", function(){
                console.log("Map Loaded");
            })

            map.on("extent-change",function(){
                console.log(JSON.stringify(map.extent));
            });

            var gl = new GraphicsLayer();

            map.addLayers([gl]);

            ko.applyBindings(vm);
            // });

    });
})();
