require([
    "esri/config",
    "esri/Map", 
    "esri/views/MapView",
    "esri/widgets/Editor",
    "esri/widgets/Legend",
    "esri/widgets/BasemapToggle",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/layers/FeatureLayer"
              ], function (esriConfig,Map, MapView, Editor, Legend, BasemapToggle, BasemapGallery, Expand, FeatureLayer) {
    

    esriConfig.apiKey = "AAPKdb181dc3a61a4ddda4cbc697d98f329f9E1CFZ0Lq_Ie9Dc9_BoP52-zFupDSqEzEBAJtI_M2JQDr3dQGfO5J8pzOBrHPJmr";


    // Create a map from the referenced webmap item id
    const map = new Map({
          basemap: "arcgis-topographic" // Basemap layer service
        });

    const view = new MapView({
        center: [-123.5121, 47.6379], //Lat, Lon
        zoom: 9,
        container: "viewDiv",
        map: map
    });
    
    //Basemap toggle widget
    const basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "arcgis-imagery"
     });
    view.ui.add(basemapToggle,"bottom-right");
    
    //Legend widget
    const legend = new Legend({
        view: view
    });
    view.ui.add(legend,"bottom-left");
    
    // Editor widget
    const editor = new Editor({
        view: view
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
        "content": "<b>Road Name: </b> {RDNAME}<br><b>Status: </b> {Status}<br><b>Status Reason: </b> {Status_Reason}<br>"
      }

    //Olympic National Park feature layer from AGOL(points)
    const olympicFeaturesLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Olympic_National_Park_Features/FeatureServer",
        outFields: ["POINAME","POITYPE","OPENTOPUBL","SEASONAL","MAINTAINER","Status","Status_Reason","OBJECTID"],
        popupTemplate: popupParkFeatures
    });

    map.add(olympicFeaturesLayer);

    //Trails layer from AGOL (lines)
    const trailsLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Olympic_National_Park_Trails/FeatureServer",
        outFields: ["TRLNAME","Trail_Length", "Maintainer","Status","Status_Reason"],
        popupTemplate: popupTrails
    });

    map.add(trailsLayer,0);

    //Roads layer from AGOL (lines)
    const roadsLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Olympic_National_Park_Roads/FeatureServer",
        outFields: ["RDNAME","Status","Status_Reason"],
        popupTemplate: popupRoads
    });

    map.add(roadsLayer,0);

    //Rivers layer from AGOL (lines)
    const riversLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Olympic_National_Park_Rivers/FeatureServer"
    });

    map.add(riversLayer,0);

    //Buildings footprints layer from AGOL (lines)
    const buildingsLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/NPS_Buildings/FeatureServer"
    });

    map.add(buildingsLayer,0);

    //Park Boundaries layer from AGOL (lines)
    const parkBoundariesLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Olympic_National_Park_Boundaries/FeatureServer"
    });

    map.add(parkBoundariesLayer,0);


    
/*    view.when(() => {
        view.map.loadAll().then(() => {
            view.map.allLayers.forEach((layer) => {
                if (layer.type === 'feature') {
                    switch (layer.geometryType) {
                        case "polygon":
                            polygonLayer = layer;
                            break;
                        case "polyline":
                            lineLayer = layer;
                            break;
                        case "point":
                            pointLayer = layer;
                            break;
                    }
                }
            });

            // Create layerInfos for layers in Editor. This
            // sets the fields for editing.

            const pointInfos = {
                layer: pointLayer,
                fieldConfig: [{
                    name: "HazardType",
                    label: "Hazard type"
                }, {
                    name: "Description",
                    label: "Description"
                }, {
                    name: "SpecialInstructions",
                    label: "Special Instructions"
                }, {
                    name: "Status",
                    label: "Status"
                }, {
                    name: "Priority",
                    label: "Priority"
                }]
            };

            const lineInfos = {
                layer: lineLayer,
                fieldConfig: [{
                    name: "Severity",
                    label: "Severity"
                }, {
                    name: "blocktype",
                    label: "Type of blockage"
                }, {
                    name: "fullclose",
                    label: "Full closure"
                }, {
                    name: "active",
                    label: "Active"
                }, {
                    name: "locdesc",
                    label: "Location Description"
                }]
            };

            const polyInfos = {
                layer: polygonLayer,
                fieldConfig: [{
                    name: "incidenttype",
                    label: "Incident Type"
                }, {
                    name: "activeincid",
                    label: "Active"
                }, {
                    name: "descrip",
                    label: "Description"
                }]
            };

            //const editor = 
            // Add widget to top-right of the view
            //view.ui.add(editor, "top-right");

            // Desktop
            var editor = new Editor({
                view: view,
                layerInfos: [{
                    layer: pointLayer,
                    fieldConfig: [pointInfos]
                },
                {
                    layer: lineLayer,
                    fieldConfig: [lineInfos]
                },
                {
                    layer: polygonLayer,
                    fieldConfig: [polyInfos]
                }
                ],
                // Set the snapping options for the Editor. By default, snapping is enabled. This can be toggled on/off using the CTRL key.
                snappingOptions: {
                    enabled: true,
                    selfEnabled: true,
                    featureEnabled: true,
                    featureSources: [{
                        layer: pointLayer
                    }, {
                        layer: lineLayer
                    }, {
                        layer: polygonLayer
                    }]
                }

            });
            view.ui.add(editor, "top-right");

            // Mobile
            var expandEditor = new Expand({
                view: view,
                content: new Editor({
                    view: view,
                    layerInfos: [{
                        layer: pointLayer,
                        fieldConfig: [pointInfos]
                    },
                    {
                        layer: lineLayer,
                        fieldConfig: [lineInfos]
                    },
                    {
                        layer: polygonLayer,
                        fieldConfig: [polyInfos]
                    }
                    ],
                    // Set the snapping options for the Editor. By default, snapping is enabled. This can be toggled on/off using the CTRL key.
                    snappingOptions: {
                        enabled: true,
                        selfEnabled: true,
                        featureEnabled: true,
                        featureSources: [{
                            layer: pointLayer
                        }, {
                            layer: lineLayer
                        }, {
                            layer: polygonLayer
                        }]
                    }

                })
            });

            // Load
            isResponsiveSize = view.widthBreakpoint === "xsmall";
            updateView(isResponsiveSize);

            // Breakpoints
            view.watch("widthBreakpoint", function (breakpoint) {
                switch (breakpoint) {
                    case "xsmall":
                        updateView(true);
                        break;
                    case "small":
                    case "medium":
                    case "large":
                    case "xlarge":
                        updateView(false);
                        break;
                    default:
                }
            });

            function updateView(isMobile) {
                setEditorMobile(isMobile);
            }

            function setEditorMobile(isMobile) {
                var toAdd = isMobile ? expandEditor : editor;
                var toRemove = isMobile ? editor : expandEditor;

                view.ui.remove(toRemove);
                view.ui.add(toAdd, "top-right");
            }
        });
    }); */
});