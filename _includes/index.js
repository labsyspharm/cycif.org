
//This is  minimal example on how to place polygon overlays with annotations in openseadragon


//init seadragon
viewer = OpenSeadragon({
    id: "openseadragon",
        prefixUrl: "/FreeSelection/css/images/",
        tileSources: "/FreeSelection/data/tiles/channel_00.dzi", //set your own pyramid location here
});


var isSelectionToolActive = false;
viewer.setControlsEnabled(true);


viewer.addHandler('open', () => {
    let printButton = new OpenSeadragon.Button({
        tooltip: 'Print',
        srcRest: `/FreeSelection/css/images/button_rest.png`,
        srcGroup: `/FreeSelection//css/images/button_grouphover.png`,
        srcHover: `/FreeSelection//css/images/button_hover.png`,
        srcDown: `/FreeSelection//css/images/button_pressed.png`,
        onClick: switchSelectionMode
    });

    viewer.addControl(printButton.element, { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });
})

switchSelectionMode = function(){
    isSelectionToolActive = !isSelectionToolActive;
    viewer.setMouseNavEnabled(!isSelectionToolActive);
    if (isSelectionToolActive){
        d3.select('body').style("cursor", "crosshair");
    }else{
        d3.select('body').style("cursor", "default");
    }
}


// Assuming we have an OpenSeadragon Viewer called "viewer", we can catch the clicks
// with addHandler like so:
viewer.addHandler('canvas-click', function(event) {
    // The canvas-click event gives us a position in web coordinates.
    var webPoint = event.position;

    // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
    var viewportPoint = viewer.viewport.pointFromPixel(webPoint);

    // Convert from viewport coordinates to image coordinates.
    var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

    // Show the results.
    console.log(webPoint.toString(), viewportPoint.toString(), imagePoint.toString());
});

//we also add an svg overlay (plugin) for the fancy stuff
svg_overlay = viewer.svgOverlay()
overlay = d3.select(svg_overlay.node())


//SELECTION POLYGON (LASSO)

polygonSelecton = [];
var renew = false;

lasso_draw = function(event){
    //add points to polygon and (re)draw
    if (renew){
        polygonSelecton = [];
        renew = false;
    }
    var webPoint = event.position;
    var viewportPoint = viewer.viewport.pointFromPixel(webPoint);
    //console.log(webPoint.toString(), viewportPoint.toString());
    polygonSelecton.push({"x":viewportPoint.x,"y":viewportPoint.y});

    d3.select('#selectionPolygon').remove();
    var selPoly = overlay.selectAll("selectionPolygon").data([polygonSelecton]);
    selPoly.enter().append("polygon")
        .attr('id', 'selectionPolygon')
        .attr("points",function(d) {
            return d.map(function(d) { return [d.x,d.y].join(","); }).join(" ");})
}

lasso_end = function(event){
    //set the last point and make the selection stale.

    var webPoint = event.position;
    var viewportPoint = viewer.viewport.pointFromPixel(webPoint);
    var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
    console.log(webPoint.toString(), viewportPoint.toString(), imagePoint.toString());
    renew = true;
    //switchSelectionMode();
}

var mouse_click = new OpenSeadragon.MouseTracker({
    element: viewer.canvas,
    clickHandler: function(event) {
        if(event.quick && isSelectionToolActive){
            console.log('clicked');
        }
    }
})

var mouse_drag = new OpenSeadragon.MouseTracker({
    element: viewer.canvas,
    dragHandler: function(event) {
        if (isSelectionToolActive) {
            console.log('dragged');
            lasso_draw(event);
        }
    }
})

var mouse_up = new OpenSeadragon.MouseTracker({
    element: viewer.canvas,
    dragEndHandler: function(event) {
        if (isSelectionToolActive) {
            console.log('release');
            lasso_end(event);
        }
    }
})


//some resizing corrections
d3.select(window).on('resize', function() {});
svg_overlay.resize();
