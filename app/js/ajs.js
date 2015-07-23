define([
        // "app/riskController",
        "app/config",
        "app/esriLoader",

        
        // "app/testdata"
        ], 
    function(
        // riskController,
        config,
        esriLoader,
        
        // testdata
    ) {

        module_map = {
            map: "esri/map",
            ArcGISImageServiceLayer: "esri/layers/ArcGISImageServiceLayer",
            ImageServiceParameters: "esri/layers/ImageServiceParameters",
            GraphicsLayer: "esri/layers/GraphicsLayer",
            Polygon: "esri/geometry/Polygon",
            SimpleFillSymbol: "esri/symbols/SimpleFillSymbol",
            graphic: "esri/graphic",
            RasterFunction: "esri/layers/RasterFunction",
            // "app/loaderController",
            geometryEngine: "esri/geometry/geometryEngine",
            FeatureLayer: "esri/layers/FeatureLayer",
            Point: "esri/geometry/Point", 
            SpatialReference: "esri/SpatialReference",
            draw: "esri/toolbars/draw"

        }
        // testdata

        ajs = {};
        ajs.import = function(moduleName){
            modulePath = module_map[moduleName];
            require([modulePath],function(module){
                ajs[moduleName] = module;
            })
        }
        return ajs;
});