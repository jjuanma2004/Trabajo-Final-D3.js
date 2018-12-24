var areaChart;
var l=0;
for(var i=0;i<data.length;i++){
	var k=1;
	for(var j=1988;j<=2015;j++){
		var p=k+l;
		data[i].values.push({x:j,y:dataY[p]});
		k=k+1;
	}
	l=l+28;
}
console.log("data",data);

nv.addGraph(function(){
	areaChart=nv.models.stackedAreaChart()
			.duration(200)
			.showLegend(false)
			.controlLabels({stacked:"Apilada",stream:"Stream",expanded:"Expandida"})
			.useInteractiveGuideline(true);

	d3.select("#areaChart").append("svg")
	  .datum(data)
	  .call(areaChart);

    return areaChart;
});