var margin = {
    top: 20,
    right: 200,
    bottom: 0,
    left: 10
},
    width = 900,
    height = 1000;

var first_stop = 1,
    last_stop = 40;

var c = d3.scale.ordinal()
    .range(["#A6CEE3", "#1F78B4", "#B2DF8A", "#33A02C", "#FB9A99", "#E31A1C", "#FDBF6F"]);

var x = d3.scale.linear()
    .range([0, width]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .ticks(last_stop);

var formatYears = d3.format("00");
xAxis.tickFormat(formatYears);

var svg = d3.select("#route_id").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//d3.json("./data/routes3.json", function(data){
//	console.log(data[0].routes[4].name);
//})

d3.json("./data/routes3.json", function(data) {
    x.domain([first_stop, last_stop]);

    var xScale = d3.scale.linear()
        .domain([first_stop, last_stop])
        .range([0, width]);


    var xAxisG = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(xAxis);

    var nstops = [];
    for (var k = 0; k < data.length; k++) {

        nstops[k] = data[k]['total'];
        //nstops[k] = data[k]['total'];
    }


    for (var j = 0; j < data.length; j++) {

    	console.log(data[j].name);
        var g = svg.append("g").attr("class", "journal");

        var circles = g.selectAll("circle")
            .data(data[j]['routes'])
            .enter()
            .append("circle");

        var text = g.selectAll("text")
            .data(data[j]['routes'])
            .enter()
            .append("text");

        var xAxisScale = d3.scale.linear()
            .domain([0, nstops[j]])
            .range([0, nstops[j] * 23.07]);


        circles
            .attr("cx", function(d, i) {
                return xAxisScale(i);
            })
            .attr("cy", j * 40 + 25)
            .attr("r", 5)
            .style("fill", function(d) {
                return "#6cb3f8";
            })
            .attr("stroke", "gray")
            .attr("stroke-width", 1)
        	.on("mouseover", circle_mouseover)
            .on("mouseout", circle_mouseout)
            .on("click", circle_mouseclick);


        g.append("text")
            .attr("y", j * 40 + 25)
            .attr("x", width + 20)
            .attr("class", "label")
            .text(data[j]['name'])
            .style("fill", function(d) {
                return "black";
            })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", textmouseclick)
            .style("font-weight", "normal")
        	.style("text-decoration", "none");


    };

    // API 
    send_to_route_view = send_to_r_v;

    function send_to_r_v(stop_name) {
        // highlight the stops
        d3.selectAll("#route_id circle").transition().attr("stroke-width",
            function(d, i) {
                //console.log(stop_name);
                if (d == stop_name) {
                    return 3;
                } else {
                    return 1;
                }
            }
        ).attr("r", function(d, i) {
            if (d == stop_name) {
                return 10;
            } else {
                return 5;
            }
        });

    }

    //API

    api_highlight_given_name = highlight_given_name;

    function highlight_given_name(stop_name) {
        d3.selectAll("#route_id circle").transition().attr("stroke-width", 1).attr("r", 5).style("fill", "#6cb3f8");
        d3.selectAll("#route_id circle").transition().attr("stroke-width",
            function(d, i) {
                //console.log(d);
                if (d == stop_name) {
                    return 1;
                } else {
                    return 1;
                }
            }
        ).attr("r", function(d, i) {
            if (d == stop_name) {
                return 10;
            } else {
                return 5;
            }
        }).style("fill", function(d, i) {
            if (d == stop_name) {
                return "#6cb3f8";
            } else {
                return "#6cb3f8";
            }
        });
    }

    function circle_mouseover() {


    	d3.select(this).style("fill", "red").attr("stroke-width", 1).attr("r", "10");
        var xpos = d3.select(this).attr("cx");
        var ypos = d3.select(this).attr("cy");
        xindex = Math.round(xpos / 23.07); //these numbers are really important
        yindex = Math.round((ypos - 25) / 40);
        stop_name = data[yindex].routes[xindex].name;
       // console.log(stop_name);
        tool_tip_x = xpos;
        tool_tip_y = ypos-10;


        xAxisG.selectAll('.tick')
        .each(function(d,i){
        	if(d==(xindex+1)){
        		d3.select(this)
        			.selectAll('text')
        			.style("fill","red");
        	}
        })

		//Create the tooltip label
        svg.append("text")
            .attr("id", "tooltip")
            .attr("x", tool_tip_x)
            .attr("y", tool_tip_y)
            .attr("text-anchor", "start")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text(stop_name);



  //       console.log(stop_name);
	//	map_highlightStops([stop_name]);
  //       console.log("after");

        var map_height = parseInt(d3.select("#map_id").style("height"));
       // d3.append("text").text("Hello World").style("fill", "black").attr("x", xpos + 35).attr("y", (map_height + ypos + 24));
        //console.log(stop_name+" "+(xpos + 35) + "," + (parseFloat(map_height) + parseFloat(ypos) + 24));

        d3.selectAll("#route_id circle").attr("stroke-width",
            function(d, i) {
                //console.log(d.name);
                if (d.name == stop_name) {
                    return 1;
   
                } else {
                    return 1;
                }
            }
        ).attr("r", function(d, i) {
            if (d.name == stop_name) {
                return 10;
            } else {
                return 5;
            }
        }).style("fill", function(d, i){
        	if (d.name == stop_name) {
        		return "red";
        	} else {
        		return "#6cb3f8";
           	}
        });

        

    }


    function circle_mouseout() {

    	d3.select("#tooltip").remove();
        var xpos = d3.select(this).attr("cx");
        var ypos = d3.select(this).attr("cy");

        xindex = Math.round(xpos / 23.07); //these numbers are really important
        yindex = Math.round((ypos - 25) / 40);
        stop_name = data[yindex].routes[xindex].name;
        //map_unhighlightStops([stop_name]);

		xAxisG.selectAll('.tick')
        .each(function(d,i){
        	//console.log(xindex);
        	if(d==(xindex+1)){
        		d3.select(this)
        			.selectAll('text')
        			.style("fill","gray");
        	}
        })

        d3.selectAll("#route_id circle").attr("stroke-width", 1).style("fill", "#6cb3f8").attr("r", "5");
        //d3.select("text").text(null);

    }

    function mouseover() {
        d3.selectAll("#route_id circle").attr("stroke-width", 1).attr("r", "5");
        var g = d3.select(this).node().parentNode;
        d3.select(g).selectAll("circle").attr("stroke-width", 1).attr("r", "10");
        var ypos = d3.select(this).attr("y");
        yindex = Math.round((ypos - 25) / 40);
        //console.log(yindex);
        //console.log(data[yindex].routes);
        stop_names = [];
        for(var i=0;i<data[yindex].routes.length;i++){
        	stop_names[i] = data[yindex].routes[i].name;
        }
        //map_highlightStopsCircleOnly(stop_names);

        d3.select(this).style("font-weight", "bold");
        d3.select(this).style("text-decoration", "underline");
    }

    function mouseout() {
        var g = d3.select(this).node().parentNode;
        d3.select(g).selectAll("circle").transition().attr("stroke-width", 1).attr("r", "5");
        var ypos = d3.select(this).attr("y");
        yindex = Math.round((ypos - 25) / 40);
        //console.log(this);
        stop_names = [];
        for(var i=0;i<data[yindex].routes.length;i++){
        	stop_names[i] = data[yindex].routes[i].name;
        }
        //map_unhighlightStops(data[yindex].routes);
        //map_unhighlightStops(stop_names);

        d3.select(this).style("font-weight", "normal");
        d3.select(this).style("text-decoration", "none");
    }

    function textmouseclick() {
        var ypos = d3.mouse(this)[1];
        yindex = Math.round((ypos - 25) / 40);
        //alert("" + data[yindex].name);
        var g = d3.select(this).node().parentNode;
        d3.select(g).selectAll("circle").attr("stroke-width", 1);
        var selected_route_ID = data[yindex].routeId;
        //console.log("Route ID is "+selected_route_ID);
        switchToTripView();
        processRouteAdherenceRidership(selected_route_ID, function(data) {
        	displayCalendar(data);
        });
    }

    // for the API

    function circle_mouseclick() {
        var xpos = d3.mouse(this)[0];
        var ypos = d3.mouse(this)[1];
        xindex = Math.round(xpos / 23.07); //these numbers are really important
        yindex = Math.round((ypos - 25) / 40);
        var selected_stop_ID = data[yindex].routes[xindex].stopId;
        //console.log(selected_stop_ID);
        switchToStopView();
    }

    // helper function which highlights other routes with the same stop

    function search_for_stopname_json(selected_stop_name) {
        var list_of_stops = [];
        var counter = 0;
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].routes.length; j++) {
                if (selected_stop_name == data[i].routes[j]) {
                    list_of_stops[counter] = [i, j];
                    counter++;
                }
            }
        }
        return list_of_stops;
    }

    function also_highlight(list_of_stops) {
        //d3.select("circle").attr("stroke-width",3);
    }
});
