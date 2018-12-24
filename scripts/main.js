var w=700;
var h=700;

var svg=d3.select("#chart").append("svg")
          .attr("width",w)
          .attr("height",h);

var simulation=d3.forceSimulation()
                 .force("link",d3.forceLink().id(function(d){return d.id;}))
                 .force("charge",d3.forceManyBody().strength(-120));

var tip=d3.tip()
      .attr("class","d3-tip")
      .offset([-10,0])
      .html(function(d){
        return "<b>Pais</b>: "+d.name;
      }); 
	  
svg.call(tip);

d3.json("contrie.json",function(error,data){

var firstLetters=[];
data.nodes.forEach(function(node){
	console.log("node",node.name[0].indexOf(firstLetters))
	var letter=node.name[0];
	if(firstLetters.indexOf(letter)===-1){
		firstLetters.push(letter);
	}
});
var colorScale=d3.scaleOrdinal()
				.domain(firstLetters)
				.range(d3.schemeCategory20);

console.log("B",colorScale("B"),"U",colorScale("U")) ;
  var link=svg.append("g")
              .attr("class","links")
              .selectAll("line")
              .data(data.links)
              .enter().append("line")
                .attr("stroke-width",1);

  var node=svg.append("g")
              .attr("class","nodes")
              .selectAll("circle")
              .data(data.nodes)
              .enter().append("circle")
              .attr("r",function(d,i){return parseInt(i/3);})
			  .attr("cx", function(d, i) { return parseInt(i); })
              .attr("cy", function(d, i) { return parseInt(i); })
              .attr("fill",function(d,i){
              	return colorScale(d.name[0]);})
              .on("mouseover",tip.show)
              .on("mouseout",tip.hide)
              .call(d3.drag()
                .on("start",dragstarted)
                .on("drag",dragged)
                .on("end",dragended));

  simulation
    .nodes(data.nodes)
    .on("tick",ticked);

  simulation.force("link")
    .links(data.links);            

  function ticked(){
    link
      .attr("x1",function(d){return d.source.x; })
      .attr("y1",function(d){return parseInt(d.source.y); })
      .attr("x2",function(d){return d.target.x; })
      .attr("y2",function(d){return parseInt(d.target.y); });

    node
      .attr("cx",function(d){return d.x; })
      .attr("cy",function(d){return parseInt(d.y); });
  };

});

function dragstarted(d){
  if(!d3.event.active) simulation.alphaTarget(0.4).restart();
  d.fx=d3.event.x;
  d.fy=parseInt(d3.event.y);
};

function dragged(d){
  d.fx=d3.event.x;
  d.fy=parseInt(d3.event.y);
};

function dragended(d){
  if(!d3.event.active) simulation.alphaTarget(0);
  d.fx=null;
  d.fy=null;
};