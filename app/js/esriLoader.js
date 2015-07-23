define([
    "dojo/Deferred",
    "esri/tasks/QueryTask", 
    "esri/tasks/query", 
    "esri/tasks/IdentifyTask", 
    "esri/tasks/IdentifyParameters",
    "esri/tasks/ImageServiceIdentifyTask",
    "esri/tasks/ImageServiceIdentifyParameters", 
    "esri/tasks/StatisticDefinition",
    "esri/request",
    "esri/tasks/PrintTask", 
    "esri/tasks/PrintParameters",
    "esri/tasks/PrintTemplate",
    "esri/tasks/AreasAndLengthsParameters", 
    "esri/tasks/GeometryService",
    "esri/SpatialReference",
    "esri/tasks/ProjectParameters",
    "esri/tasks/BufferParameters"
], 
function(
    Deferred,
    QueryTask, 
    Query, 
    IdentifyTask, 
    IdentifyParameters,
    ImageServiceIdentifyTask, 
    ImageServiceIdentifyParameters, 
    StatisticDefinition, 
    esriRequest,
    PrintTask, 
    PrintParameters, 
    PrintTemplate,
    AreasAndLengthsParameters, 
    GeometryService,
    SpatialReference,
    ProjectParameters,
    BufferParameters
) {

    var o = {};

    // *** Helper methods ***

    var obj_to_esriParams = function(esriParamTarget, obj){
        //Utility function, takes a <Parameter> type object and JSON
        //and applies all properties in JSON to the Parameter object
        for (param in obj){
            if (obj.hasOwnProperty(param)){
                if (obj[param]){
                    esriParamTarget[param] = obj[param];
                }
            }
        }
        return esriParamTarget
    }

    var execute_task = function(task,params){
        //Execute a <Task> type object with params
        var deferred = new Deferred();
        task.execute(params, function(results){
            results['query'] = params;
            deferred.resolve(results);
        },
        function(err){
            deferred.resolve(err);
        });
        return deferred;
    }


    var getGeometryUnits = function(params){
        params.lengthUnit = GeometryService[params.lengthUnit];
        params.areaUnit = GeometryService[params.areaUnit];
        return params;
    }


    //*** Public methods ***
    o.serviceJson = function(url){
        //Returns the JSON representation at an endpoint
        var deferred = new Deferred();
        var layersRequest = esri.request({
          url: url,
          content: { f: "json" },
          handleAs: "json"
        });
        layersRequest.then(
          function(response) {
            deferred.resolve(response);
        }, function(error) {
            console.log("Error: ", error.message);
            deferred.resolve(error);

        });

        return deferred;
    }

    o.esriRequest = function(url,content){
        //Wrapper around esri.request call
        //sends POST request to url with content as JSON
        var deferred = new Deferred();
        var layersRequest = esri.request({
          url: url,
          content: content,
          handleAs: "json"
        },{usePost:true});
        layersRequest.then(
          function(response) {
            deferred.resolve(response);
        }, function(error) {
            console.log("Error: ", error.message);
            deferred.resolve(error);

        });

        return deferred;
    }

    o.queryForStats = function(url, params, statdefs){
        //Create StatisticDefinition object for a query,
        //then query layer
        var deferred = new Deferred();
        var statDefArray = statdefs.map(function(def){
            return obj_to_esriParams(new StatisticDefinition(),def);
        })
        params.outStatistics = statDefArray;
        return o.queryEsri(url, params)
        
    }

    o.identify = function(url,params,option){
        //Identify an esri mapserver endpoint url with params in JSON format
        var identifyTask = new IdentifyTask(url);
        var identifyParams = obj_to_esriParams(new IdentifyParameters(), params);

        identifyParams.layerOption = option? IdentifyParameters[option] : IdentifyParameters['LAYER_OPTION_TOP'];

        var deferred = execute_task(identifyTask,identifyParams);
        return deferred
    }

    o.queryEsri = function(url, params) {
        //Query an esri endpoint url with query params in JSON format
        var queryTask = new QueryTask(url);
        var query = obj_to_esriParams(new Query(), params);
        var deferred = execute_task(queryTask,query);
        return deferred
    };

    o.getQuery = function(params) {
        return obj_to_esriParams(new Query(), params);
    }

    o.queryJson = function() {

    };

    o.getUniqueFields = function(url,field,where) {
        //Returns feature set with only distinct fields for a given
        //field and optional where clause
        where = where || "1=1";
        return o.queryEsri(url,{
            where: where,
            outFields:[field],
            returnDistinctValues:true
        });
    }

    o.computeHistogram = function(url, content) {
        //sends a request to computeHistogram endpoint of an Image service
        //content is a JSON object with url parameters
            if(content.geometry){
                content.geometry = JSON.stringify(content.geometry);
            }
            if(content.renderingRule){
                content.renderingRule = JSON.stringify(content.renderingRule);
            }
            if(content.mosaicRule){
                content.mosaicRule = JSON.stringify(content.mosaicRule);
            }
            content.geometryType = content.geometryType || 'esriGeometryPolygon';

            return esriRequest({
                url: url + '/computeHistograms',
                content: content,
                handleAs: 'json',
                callbackParamName: 'callback',
                timeout: 60000
            }, {
                usePost: true
            });
    };

    o.exportMapImage = function(map, printUrl, width, height){
        //Sends request to export a map image only to a Print Service
        //Given a map object, url to print service and width/height
        var deferred = new Deferred();
          var template = new PrintTemplate();
          template.exportOptions = {
            width: width,
            height: height,
            dpi: 96
          };
          template.format = "png32";
          template.layout = "MAP_ONLY";
          template.preserveScale = false;
          
          var params = new PrintParameters();
          params.map = map;
          params.template = template;

          var printTask = new PrintTask(printUrl);

          printTask.execute(params, function(result){
                deferred.resolve(result);
          });
          return deferred;
    }

    o.geometry = {}

    o.geometry.getAreasLengths = function(url,params){
        //Request Areas and Lengths at geometry service url with params
        var deferred = new Deferred();
        params = getGeometryUnits(params);
        var al_params = obj_to_esriParams(new AreasAndLengthsParameters(),params);
        var geometryService = new GeometryService(url);
        
        return geometryService.areasAndLengths(al_params)
    }

    o.geometry.project = function(url,params,outWkid){
        //Request project at geometry service url with params and outWkid spatial reference

        var deferred = new Deferred();
        params.outSR = new SpatialReference(outWkid)
        var geometryService = new GeometryService(url);
        var projParams = obj_to_esriParams(new ProjectParameters(),params);
        
        return geometryService.project(projParams)
    }

    o.geometry.buffer = function(url,params,wkid){
        //Request project at geometry url with params and outWkid spatial reference

        var deferred = new Deferred();
        var bufferParams = obj_to_esriParams(new BufferParameters(),params);
        bufferParams.unit = GeometryService[params.unit];
        bufferParams.spatialReference = params.geometries[0].spatialReference;
        bufferParams.outSpatialReference = new SpatialReference(wkid);
        var geometryService = new GeometryService(url);
        
        return geometryService.buffer(bufferParams)
    }

    return o;
});