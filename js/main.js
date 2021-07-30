//Array for use with Olympic Features filter
var olympicFeaturesLayer;
var arrPointType = [];

require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Editor",
    "esri/widgets/Legend",
    "esri/widgets/BasemapToggle",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/Locate",
    "esri/widgets/Home",
    "esri/layers/FeatureLayer",
    "esri/widgets/LayerList"
], function (esriConfig, Map, MapView, Editor, Legend, BasemapToggle, BasemapGallery, Expand, Locate, Home, FeatureLayer, LayerList) {


    esriConfig.apiKey = "AAPKdb181dc3a61a4ddda4cbc697d98f329f9E1CFZ0Lq_Ie9Dc9_BoP52-zFupDSqEzEBAJtI_M2JQDr3dQGfO5J8pzOBrHPJmr";


    // Create a map from the referenced webmap item id
    const map = new Map({
        basemap: "arcgis-topographic" // Basemap layer service (ArcGIS)
    });

    //Set default view parameters
    const view = new MapView({
        center: [-123.5121, 47.6379], //Lat, Lon
        zoom: 9,
        container: "viewDiv",
        map: map,
        visibilityMode: 'exclusive'
    });
    
    const homeBtn = new Home({
        view: view
        });
    view.ui.add(homeBtn, "top-left");
    
    //Geolocation widget 
    const locate = new Locate({
          view: view,
          useHeadingEnabled: false,
          goToOverride: function(view, options) {
            options.target.scale = 5000;
            return view.goTo(options.target);
          }
        });
        view.ui.add(locate, "top-left");

    //Basemap toggle widget
    const basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "arcgis-imagery"
    });
    view.ui.add(basemapToggle, "bottom-right");

    // Editor widget
    const editor = new Expand({
        content: new Editor({
            view: view
        }),
        view: view,
        expanded: false
    });
    view.ui.add(editor, "top-right");

    //Define popup windows
    const popupParkFeatures = {
        "title": "{POINAME} - {POITYPE}",
        "content": "<b>Point Name: </b> {POINAME}<br><b>Point Type: </b> {POITYPE}<br><b>Open to public: </b> {OPENTOPUBL}<br><b>Seasonal: </b> {SEASONAL}<br><b>Maintainer: </b> {MAINTAINER}<br><b>Status: </b> {Status}<br><b>Status Reason: </b> {Status_Reason}<br><b>OBJECTID: </b> {OBJECTID}<br>"
    }
    const popupTrails = {
        "title": "{TRLNAME}",
        "content": "<b>Trail Name: </b> {TRLNAME}<br><b>Length: </b> {Trail_Length} miles<br><b>Maintainer: </b> {MAINTAINER}<br><b>Status: </b> {Status}<br><b>Status Reason: </b> {Status_Reason}<br>"
    }
    const popupRoads = {
        "title": "{RDNAME}",
        "content": "<b>Road Name: </b> {RDNAME}<br><b>Road Surface: </b> {RDSURFACE}<br><b>Seasonal: </b> {SEASONAL}<br><b>Maintainer: </b> {MAINTAINER}<br><b>Notes: </b> {NOTES}<br><b>Status: </b> {Status}<br><b>Status Reason: </b> {Status_Reason}<br>"
    }

    const popupBuildings = {
        "title": "{BLDGNAME}",
        "content": "<b>Building Name: </b> {BLDGNAME}<br><b>Type: </b> {BLDGTYPE}<br><b>Status: </b> {BLDGSTATUS}<br><b>Seasonal: </b> {SEASONAL}<br>"
    }
    
    const popupRivers = {
        "title": "{River}",
        "content": "<b>Water Body Name: </b> {River}<br><b>Reach: </b> {Reach}<br><b>Description: </b> {Descriptio}<br><b>County: </b> {County}<br><b>Classification: </b> {Classification}<br><b>Watershed: </b> {Watershed_}<br>"
    }

    //Olympic National Park feature layer from AGOL(points)
    olympicFeaturesLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Olympic_National_Park_Features/FeatureServer",
        outFields: ["POINAME", "POITYPE", "OPENTOPUBL", "SEASONAL", "MAINTAINER", "Status", "Status_Reason", "OBJECTID"],
        definitionExpression: "POITYPE = ''",
        popupTemplate: popupParkFeatures
    });

    map.add(olympicFeaturesLayer, 0);

    //olympicFeaturesLayer.definitionExpression = "POITYPE = 'Entrance Station' OR POITYPE = 'Campground'";


    //Trails layer from AGOL (lines)
    const trailsLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Olympic_National_Park_Trails/FeatureServer",
        outFields: ["TRLNAME", "Trail_Length", "Maintainer", "Status", "Status_Reason"],
        popupTemplate: popupTrails
    });

    map.add(trailsLayer, 0);

    //Roads layer from AGOL (lines)
    const roadsLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Olympic_National_Park_Roads/FeatureServer",
        outFields: ["RDNAME", "Status", "Status_Reason"],
        popupTemplate: popupRoads
    });

    map.add(roadsLayer, 0);

    //Rivers layer from AGOL (lines)
    const riversLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Olympic_National_Park_Rivers/FeatureServer",
        outFields: ["River","Reach","Descriptio","County","Classification","Watershed"],
        popupTemplate: popupRivers
    });

    map.add(riversLayer, 0);

    //Buildings footprints layer from AGOL (lines)
    const buildingsLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/NPS_Buildings/FeatureServer",
        outFields: ["BLDGNAME", "BLDGSTATUS", "BLDGTYPE", "SEASONAL"],
        popupTemplate: popupBuildings
    });

    map.add(buildingsLayer, 0);

    //Park Boundaries layer from AGOL (lines)
    const parkBoundariesLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Olympic_National_Park_Boundaries/FeatureServer"
    });

    map.add(parkBoundariesLayer, 0);

    var layerlist = new LayerList({
        view: view,

        listItemCreatedFunction: function (event) {
            const item = event.item;
            if (item.layer.type != "group") { // won't show legend twice
                item.panel = {
                    content: "legend",
                    open: true
                };
            }
        }

        /////////////////////////////////////////////////////////////////////
    });

    const legend = new Expand({
        content: layerlist,
        view: view,
        expanded: false
    });
    view.ui.add(legend, "bottom-left");

    /////////////////////////////////////////////
});

var interval = setInterval(checkforPoints, 1000);

function checkforPoints() {
    let points = document.getElementsByClassName('esri-legend__layer-row');
    console.log(points.length)
    if (points.length >= 10) {
        clearInterval(interval);

        //animVal

        let pointTypes = '';
        arrPointType = [];
        document.getElementById('divFilters').innerHTML = '';

        for (let i = 0; i < 10; i++) {
            let image = points[i].children[0].children[0].children[0].children[0].children[1].children[0].href.baseVal;
            let text = points[i].children[1].innerHTML;
            let value = "POITYPE = '" + points[i].children[1].innerHTML + "'";
            arrPointType.push(value);
            pointTypes += `<div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" value="${value}" checked onchange="changeFilter(this)">
                                <label class="form-check-label">
                                    <img src="${image}"/>
                                    ${text}
                                </label>
                            </div>`;
        }

        let reset = `<br /> <button class="btn btn-danger form-control" onclick="checkforPoints()">Reset</button>`;
        document.getElementById('divFilters').innerHTML = pointTypes + reset;
        olympicFeaturesLayer.definitionExpression = arrPointType.join(" OR ");
    }
}

function changeFilter(ele) {
    if (ele.checked) {
        //alert(ele.value)
        arrPointType.push(ele.value);
        olympicFeaturesLayer.definitionExpression = arrPointType.join(" OR ");
    }
    else {
        const index = arrPointType.findIndex(element => element === ele.value)
        arrPointType.splice(index, 1);
        if (arrPointType.length == 0)
            olympicFeaturesLayer.definitionExpression = "POITYPE = ''";
        else
            olympicFeaturesLayer.definitionExpression = arrPointType.join(" OR ");
    }
}
