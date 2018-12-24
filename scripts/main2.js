var w=500;
var h=500;


var svg=d3.select("#chart2")
          .append("svg")
            .attr("width",w)
            .attr("height",h);

 
var projection = d3.geoEquirectangular()
                   .center([70,-11])
                   .scale([300]);

var path=d3.geoPath()
          .projection(projection);

var color=d3.scaleQuantize()
    .range(['#f1eef6','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b']);
var gdpScale=d3.scaleLinear()
    .range([3,w/20]);
var tip=d3.tip()
          .attr("class","d3-tip")
          .offset([-10,0])
          .html(function(d){
            return "<b>País</b>: "+d.properties.NAME+
            "</br><b>Exportacion</b>: "
            +d3.format("$,d")(d.properties["POP_EST"])+
            "</br><b>Importacion</b>: "
            +d3.format("$,d")(d.properties["GDP_MD_EST"]*100);
          });
svg.call(tip);
d3.json("countries_dat.json",function(error,data){
  color.domain(d3.extent(data.features,
    function(d){return d.properties["GDP_MD_EST"];}));
  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
      .attr("d",path)
      .attr("fill",function(d){
        return color(d.properties["GDP_MD_EST"]);
      })
      .attr("class","map-path");

	gdpScale.domain(d3.extent(data.features,
    function(d){return d.properties["POP_EST"];}));
  
    svg.selectAll(".map-bubble")
	    .data(data.features)
	    .enter()
	    .append("circle")
	      .attr("class","map-bubble")
	      .attr("cx",function(d){
	        return path.centroid(d)[0];
	      })
	      .attr("cy",function(d){
	        return path.centroid(d)[1];
	      })
	      .attr("r",function(d){
	        return gdpScale(d.properties["POP_EST"]);
	      })
	      .on("mouseover",tip.show)
	      .on("mouseout",tip.hide)
	      .style("fill","#fc8d59")
	      .style("opacity",0.8);

});