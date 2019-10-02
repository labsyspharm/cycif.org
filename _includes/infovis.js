
infovis = {};

infovis.renderMatrix = function(wid_waypoint, visdata){
    d3.csv(visdata)
        .then(function(data) {

            //tooltip
            var tooltip = d3.select("#viewer-waypoint").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            //vis object
            var vis = {};

            //all framing stuff
            vis.margin = { top: 40, right: 40, bottom: 0, left: 60 };
            vis.size = wid_waypoint.clientWidth;
            vis.width = vis.size - vis.margin.left - vis.margin.right;
            // vis.cellPadding = vis.width/data.length/3;
            // vis.cellHeight = vis.cellPadding * 2;
            // vis.cellWidth = vis.cellHeight;
            vis.cellPadding = 4;
            vis.cellWidth = (vis.width / Object.keys(data[0]).length) - vis.cellPadding;
            vis.cellHeight = vis.cellWidth;
            //vis.height = vis.size - vis.margin.top - vis.margin.bottom;
            vis.height = data.length*(vis.cellWidth+vis.cellPadding)+vis.margin.top + vis.margin.bottom;

            //preprocesing
            vis.max = Number.MIN_VALUE;
            vis.min = Number.MAX_VALUE;
            data.forEach(function(d){
                vis.min = Math.min(vis.min, d3.min(Object.values(d)) );
                vis.max = Math.max(vis.max, d3.max(Object.values(d)) );
            });

            //colorscale (YlGnBu is colorblind safe, print friendly, photocopy safe)
            var ticks = 6;
            var myColor = d3.scaleQuantize().domain([vis.min,vis.max]).range(colorbrewer.YlGnBu[ticks])


            // SVG drawing area
            if (d3.select("#matrix").empty() ) {

                //the svg everything goes into
                vis.svg = d3.select("#viewer-waypoint").append("svg")
                    .attr('id', 'matrix')
                    .attr("width", vis.width + vis.margin.left + vis.margin.right)
                    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

                //a row
                var row = vis.svg.selectAll(".matrix-row")
                    .data(data, function (dataRow) {
                        return dataRow;
                    })
                    .enter()
                    .append("g")
                    .attr("class", "matrix-row")
                    .attr("transform", function (d, index) {
                        return "translate(0," + (
                            vis.cellHeight + vis.cellPadding) * index + ")";
                    });

                //the labels on the y axis (left)
                row.append("text")
                    .attr("class", "matrix-label matrix-row-label")
                    .attr("x", -10)
                    .attr("y", vis.cellHeight / 2)
                    .attr("dy", ".35em")
                    .attr("text-anchor", "end")
                    .text(function (d,i) {
                        return 'cluster ' + [i];
                    })
                    .style('opacity', 1)
                    .on("click", function(d,i) { alert('clicked on row' + i); });

                // the cells (colored rectangles)
                var cell = row.selectAll(".matrix-cell-business")
                    .data(function (row) {
                        return Object.values(row);
                    })
                    .enter().append("rect")
                    .attr("class", "matrix-cell matrix-cell-business")
                    .attr("height", vis.cellHeight)
                    .attr("width", vis.cellWidth)
                    .attr("x", function (d, index) {
                        return (vis.cellWidth + vis.cellPadding) * index;
                    })
                    .attr("fill", function (d) {
                        return myColor(d);
                    })
                    .on("mouseover", function(d) {
                        d3.select(this).attr('stroke', 'white')
                            .attr('stroke-width', '2');
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .8);
                        tooltip.html('' + parseFloat(d).toFixed(2))
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY-vis.margin.top) + "px");
                    })
                    .on("mouseout", function(d) {
                        d3.select(this).attr('stroke', 'black')
                            .attr('stroke-width', '0');
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });;

                // the x-axis labels (top)
                var columnLabel = vis.svg.selectAll(".matrix-column-label")
                    .data(Object.keys(data[0]))
                    .enter()
                    .append("text")
                    .attr("class", "matrix-label matrix-column-label")
                    .attr("text-anchor", "start")
                    .attr("transform", function(d, index){
                        return "translate(" + (index * (vis.cellWidth + vis.cellPadding) + (vis.cellWidth+vis.cellPadding)/2) + ",-8) rotate(270)"
                    })
                    .text(function(d,i){
                        return d;
                    })
                    .on("click", function(d,i) { alert('clicked on column' + i); });;

                //dynamic legend
                vis.svg.append("g")
                    .attr("class", "colorLegend")
                    .attr("transform", "translate(" + (vis.width+10) + ",0)");
                var colorLegend = d3.legendColor()
                    .shapeWidth(5)
                    .shapeHeight(((data.length*(vis.cellWidth+vis.cellPadding))-vis.cellPadding)/ticks - 1)
                    .cells(d3.range(vis.min, vis.max, (vis.max - vis.min) /(ticks)) )
                    .scale(myColor);
                vis.svg.select(".colorLegend")
                    .call(colorLegend);


            }//if not yet drawn

        })
        .catch(function(error){
            console.log('error loading vis data:' + error);
        })
}


infovis.renderBarChart = function(wid_waypoint, visdata){
   //to be implemented
}

infovis.renderBoxPlot = function(wid_waypoint, visdata){
    //to be implemented
}

infovis.renderScatterplot = function(wid_waypoint, visdata){
    //to be implemented
}

