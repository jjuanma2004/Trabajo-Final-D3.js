// easy d3-based word cloud plugin https://github.com/wvengen/d3-wordcloud
// requires https://github.com/jasondavies/d3-cloud
// based on https://github.com/shprink/d3js-wordcloud
(function() {
  function wordcloud() {
    var selector = '#wordcloud',
        element = d3.select(selector),
        transitionDuration = 200,
        scale = 'sqrt',
        fill = d3.scale.category20b(),
        layout = d3.layout.cloud(),
        fontSize = null,
        svg = null,
        vis = null,
        onwordclick = undefined;

    wordcloud.element = function(x) {
      if (!arguments.length) return element;
      element = x == null ? '#wordcloud' : x;
      return wordcloud
    };

    wordcloud.selector = function(x) {
      if (!arguments.length) return selector;
      element = d3.select(x == null ? selector : x);
      return wordcloud;
    };

    wordcloud.transitionDuration = function(x) {
      if (!arguments.length) return transitionDuration;
      transitionDuration = typeof x == 'function' ? x() : x;
      return wordcloud;
    };

    wordcloud.scale = function(x) {
      if (!arguments.length) return scale;
      scale = x == null ? 'sqrt' : x;
      return wordcloud;
    };

    wordcloud.fill = function(x) {
      if (!arguments.length) return fill;
      fill = x == null ? d3.scale.category20b() : x;
      return wordcloud;
    };

    wordcloud.onwordclick = function (func) {
        onwordclick = func;
        return wordcloud;
    }

    wordcloud.start = function() {
      init();
      layout.start(arguments);
      return wordcloud;
    };

    function init() {
      layout
        .fontSize(function(d) {
          return fontSize(+d.size);
        })
        .text(function(d) {
          return d.text;
        })
        .on("end", draw);

      svg = element.append("svg");
      vis = svg.append("g").attr("transform", "translate(" + [layout.size()[0] >> 1, layout.size()[1] >> 1] + ")");

      update();
      svg.on('resize', function() { update() });
    }

    function draw(data, bounds) {
      var w = layout.size()[0],
          h = layout.size()[1];

      svg.attr("width", w).attr("height", h);

      scaling = bounds ? Math.min(
        w / Math.abs(bounds[1].x - w / 2),
        w / Math.abs(bounds[0].x - w / 2),
        h / Math.abs(bounds[1].y - h / 2),
        h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

      var text = vis.selectAll("text")
        .data(data, function(d) {
          return d.text.toLowerCase();
        });
      text.transition()
        .duration(transitionDuration)
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .style("font-size", function(d) {
          return d.size + "px";
        });
      text.enter().append("text")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .style("font-size", function(d) {
          return d.size + "px";
        })
        .style("opacity", 1e-6)
        .transition()
        .duration(transitionDuration)
        .style("opacity", 1);
      text.style("font-family", function(d) {
          return d.font || layout.font() || svg.style("font-family");
        })
        .style("fill", function(d) {
          return fill(d.text.toLowerCase());
        })
        .text(function(d) {
          return d.text;
        })
        // clickable words
        .style("cursor", function(d, i) {
          if (onwordclick !== undefined) return 'pointer';
        })
        .on("mouseover", function(d, i) {
          if (onwordclick !== undefined) {
            d3.select(this).transition().style('font-size', d.size + 3 + 'px');
          }
        })
        .on("mouseout", function(d, i) {
          if (onwordclick !== undefined) {
            d3.select(this).transition().style('font-size', d.size + 'px');
          }
        })
        .on("click", function(d, i) {
          if (onwordclick !== undefined) {
                onwordclick(d,i);
            }
        });

      vis.transition()
        .attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scaling + ")");
    };

    function update() {
      var words = layout.words();
      fontSize = d3.scale[scale]().range([10, 100]);
      if (words.length) {
        fontSize.domain([+words[words.length - 1].size || 1, +words[0].size]);
      }
    }

    return d3.rebind(wordcloud, layout, 'on', 'words', 'size', 'font', 'fontStyle', 'fontWeight', 'spiral', 'padding');
  }

  if (typeof module === "object" && module.exports) module.exports = wordcloud;
  else d3.wordcloud = wordcloud;
})();

var data=[{key:'Animal',y:3,color:'#98FB98',ranges:[0,50,100],values:[]},{key:'Capital goods',y:10,color:'#AFEEEE',ranges:[0,50,100],values:[]},{key:'Chemicals',y:17,color:'#D87093',ranges:[0,50,100],values:[]},{key:'Consumer goods',y:24,color:'#FFEFD5',ranges:[0,50,100],values:[]},{key:'Food Products',y:31,color:'#FFDAB9',ranges:[0,50,100],values:[]},{key:'Footwear',y:38,color:'#CD853F',ranges:[0,50,100],values:[]},{key:'Fuels',y:45,color:'#FFC0CB',ranges:[0,50,100],values:[]},{key:'Hides and Skins',y:52,color:'#DDA0DD',ranges:[0,50,100],values:[]},{key:'Intermediate goods',y:59,color:'#B0E0E6',ranges:[0,50,100],values:[]},{key:'Mach and Elec',y:66,color:'#800080',ranges:[0,50,100],values:[]},{key:'Metals',y:73,color:'#FF0000',ranges:[0,50,100],values:[]},{key:'Minerals',y:80,color:'#BC8F8F',ranges:[0,50,100],values:[]},{key:'Miscellaneous',y:87,color:'#4169E1',ranges:[0,50,100],values:[]},{key:'Plastic or Rubber',y:94,color:'#8B4513',ranges:[0,50,100],values:[]},{key:'Raw materials',y:101,color:'#FA8072',ranges:[0,50,100],values:[]},{key:'Stone and Glass',y:108,color:'#F4A460',ranges:[0,50,100],values:[]},{key:'Textiles and Clothing',y:115,color:'#2E8B57',ranges:[0,50,100],values:[]},{key:'Transportation',y:122,color:'#FFF5EE',ranges:[0,50,100],values:[]},{key:'Vegetable',y:129,color:'#A0522D',ranges:[0,50,100],values:[]},{key:'Wood',y:136,color:'#C0C0C0',ranges:[0,50,100],values:[]}];var dataY=[12655.06,24932.88,29133.65,39737.24,50931.64,52654.1,72583.85,89040.79,90468.15,90975.88,87093.43,86786.68,90016.51,93761.76,94609.05,107739.74,124895.32,140139.29,150218.71,171897.26,200140.47,178223.48,202785.49,239860.31,238848.47,261406.11,276167.66,233686.51,282312.1,383450.12,433228.2,644551.79,749997.95,777302.89,1050713.79,1289787.82,1349957.89,1425086.7,1463210.53,1533980.75,1724744.37,1617778.69,1649951.12,1882957.44,2283985.74,2519436.5,2871814.35,3263806.09,3550297.22,2778727.76,3369885.19,3833001.31,3854631.74,3948699.42,4011911.74,3761089.14,60641.59,80297.3,91352.49,130618.72,155706.17,157118.18,223225.23,292676.23,303905.84,320123.1,334338.46,351989.36,367879.06,387185.53,438841.66,522611.42,633123.99,705106.55,786763.32,910332.81,1052557.45,928554.43,1059333.19,1210463.28,1186659.8,1221678.62,1233546.72,1129318.97,205217.97,314802.04,374322.98,473587.28,618304.55,629029.79,877061.37,1069300.58,1138844.91,1184829.56,1214935.91,1254391.11,1356429.04,1388785.08,1499719.5,1757253.95,2064822.25,2327800.7,2669390.32,3088496.54,3529790.59,2789171.5,3341195.71,3901259.17,3951499.32,4296383.99,4389945.62,3800970.64,12150.9,27634.29,32890.64,49467.72,66377.32,70197.06,103802.37,127964.88,140343.01,138609.04,133823.45,129222.29,127044.41,135838.67,143609.04,166690.64,190436.38,208099.35,236562.06,273539.02,318384.95,298401.25,327805.19,384599.25,395025.74,423003.45,423633.04,381036.23,2773.33,6443.42,7879.52,9346.7,16326.1,18384.37,29613.74,32662.17,35573.8,36363.08,35516.79,35465.57,36595.75,37858.22,39488.05,44602.37,50544.14,55898.99,63356.02,72096.21,80755.16,73379.25,86876.99,103671.1,106591.37,117381.18,128476.65,116795.83,10952.31,52716.4,76014.76,90210.33,98253.42,114212.28,125961,144015.18,182298.68,180757.87,138969.5,161205.94,280751.11,268921.34,266400.85,336393.79,446427.23,579575.28,753246.17,875213.59,1305323.28,734043.84,1104357.91,1299606.29,1420817.56,1537681.41,1456167.51,869423.45,4614.29,7632.98,8039.99,9926.33,14658.31,15427.75,25540.75,29833.17,31104.74,31553.28,29040.4,27600.55,32786.65,35522.16,36103.18,41426.86,47692.63,51593.86,56217.75,61733.05,64764.61,52379.76,67360.44,84281.66,86478.58,96889.6,97612.2,90048.06,177910.02,279242.97,304714.3,395415.54,468055.2,473791.93,644415.91,857929.79,857597.07,876570.1,859578.35,857333.69,940224.96,919889.38,965535.85,1132704.99,1404997.93,1572761.43,1852901.57,2188717.08,2495245.52,1860616.31,2334772.76,2820558.16,2797382.78,2857112.96,2782665.71,2441143.74,231540.68,307298.61,351783.24,502974.02,593282.03,625527.16,853230.95,1067295.65,1115200.45,1168681.37,1180867.01,1246268.95,1424538.67,1313107.72,1331017.87,1521696.45,1850474.25,2054072.59,2341047.6,2649120.19,2868759.65,2286737.14,2749786.61,3077078.67,3051835.28,3134413.48,3189314.52,2974853.42,64326.54,99393.1,105394.36,123396.48,144365.95,142956.35,201837.71,280879.02,272566.75,283708.16,275046.43,262279.18,291330.18,280348.74,297203.11,352276.74,486233.15,564857.48,725651.93,889691.73,1003562.15,633536.42,828392.21,999650.23,942193.21,922773.55,945931.65,805062.17,5269.96,15038.87,17604.37,20043.26,23775.46,21234.09,25162.98,34319.86,35409.71,37350.7,34569.74,32917.09,35058.87,34882.63,35670.04,40764.12,58883.88,85076.33,110462.46,133434.34,163678.44,129853.73,204014.18,267975.53,241412.52,251733.18,229200.09,164736.94,66483.66,84309.83,102913.18,153384.08,190307.38,205481.04,253995.61,319838.05,322551.7,345427.93,342536.74,355476.05,427576.42,405225.74,412380.8,502041.41,601006.26,616099.06,703670.14,879132.45,982253.77,895777.9,1006939.95,1118665.48,1168932.85,1229095.66,1275213.56,1216919.78,30127.06,43577.76,49151.92,66442.79,78190.02,77480.12,114011.12,156594.15,157473.35,164152.13,166675.72,169598.89,184366.36,179972.83,192350.9,227332.48,278905.3,318436,366889.91,423650.49,458238.38,362906.5,457649.07,545673.06,540215.14,562096.88,564031.25,496050.82,34027.16,97950.88,120858.13,172833.9,200960.93,211354.49,260933.9,321081.83,350761.38,351095.33,304455.06,311013.85,381566.96,373555.13,379412.19,444411.59,558975.7,663490.44,812615.72,968342,1299426.9,900280.38,1236439.81,1479478.46,1435609.62,1541658.43,1483096.85,1064535.4,21828.49,30017.68,34464.82,45250.92,54582.82,63400.02,87329.32,119131.52,125251.65,126513.38,126606.9,133128.13,143730.75,140476.28,147615.25,167762.21,200772.71,229135.01,274927.41,324192.89,369691.33,322047.07,414535.48,556971.1,663793.35,683139.47,611414.96,532977.86,40202.41,58800.57,68136.35,83662.12,125740.04,122467.68,177316.29,217241.78,223592.19,236530.13,237863.91,230664.91,248865.12,245342.18,259595.95,308748.53,349739.41,376302.9,421466.57,472392.65,499140.65,428421.1,497909.35,592443.03,557663.5,605154.2,624473.91,568606.56,126239.27,179698.49,202819.75,283366.12,330576.27,322950.08,417213.67,484336.74,505503.17,536663.85,585041.55,601238.1,616005.74,626046.83,672699.78,757222.01,873681.97,947879.49,1071861.6,1239544.86,1319740.6,911784.74,1140752.22,1320340.06,1333410.27,1360078.92,1390645.32,1328294.88,9169.42,32897.75,36579.99,61863.78,75741.04,77045.13,109632.9,135263.7,145005.38,147813.15,142971.07,133065.76,124486.73,126895.19,136338.31,161486.46,181864.45,194216.3,215159.73,277605.4,368766.75,309176.83,357190.44,451182.82,459399.56,472160.9,466699.59,404602.29,26420.13,60947.97,66471.43,85001.77,105585.61,105859.11,136146.62,178434.39,167764.96,166628.46,163328,167207.97,180676.45,171891.99,176892.64,199153.47,230222.64,243344.53,264197.31,294468.44,305052.88,250267.01,288256.47,318814.76,303004.99,320238.29,329034.52,286364.16,286364.16];

