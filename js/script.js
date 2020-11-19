function pianoData(data, name){
  let timeline = loadFile('data/timeline.csv').then(timeline => {
    piano(data, timeline, name);
  });
}

function piano(data, timeline, name) {
  // console.log(timeline);
  d3.select('#piano').selectAll('rect').remove();
  let pianokeys = Array.from(Array(53).keys());
  let pianos = d3.select('#piano').selectAll('rect')
    .data(pianokeys)
    .join('rect')
    // .attr('x', d => d*20)
    .attr('x', 0)
    .attr('y', d => d * 12)
    .attr('width', 170)
    .attr('height', 12)
    .classed('keys', true);
    // .on('mouseover', (d, i, g) => {
    //   d3.select(g[i]).classed('hovered', true);
    // })
    // // .on('click', playSound('coin'))
    // .on('mouseout', (d, i, g) => {
    //   d3.select(g[i]).classed('hovered', false);
    // });

  // let blackkeys = Array.from(Array(50).keys());
  let blackkeys = [0, 1, 2, 4, 5, 7, 8, 9, 11, 12, 14, 15, 16, 18, 19, 21, 22, 23, 25, 26, 28, 29, 30, 
    32, 33, 35, 36, 37, 39, 40, 42, 43, 44, 46, 47, 49, 50, 51];

  let blacks = d3.select('#blackkeys').selectAll('rect')
    .data(blackkeys)
    .join('rect')
    .attr('x', 0)
    .attr('y', d => 8 + d * 12)
    .attr('width', 80)
    .attr('height', 8)
    .classed('blackkeys', true);
    // .on('mouseover', (d, i, g) => {
    //   d3.select(g[i]).classed('hovered', true);
    // })
    // .on('mouseout', (d, i, g) => {
    //   d3.select(g[i]).classed('hovered', false);
    // });

    let pianoScaleX = d3.scaleLinear()
      .domain([1390, 2007])
      .range([0, 630]);

    let pianoScaleY = d3.scaleLinear()
      .domain([0, 270000])
      .range([170, 0]);

    //These additions to data make sure that keys which are above the line graph are hidden.
    if(data.length != 0){
      /*
    data.unshift({x:pianoScaleX.invert(1200), y:pianoScaleY.invert(245)});
    data.unshift({x:pianoScaleX.invert(1200), y:pianoScaleY.invert(0)});
    data.unshift({x:pianoScaleX.invert(0), y:pianoScaleY.invert(0)});
    data.push({x:pianoScaleX.invert(1038), y:pianoScaleY.invert(250)});
    data.push({x:pianoScaleX.invert(1037), y:pianoScaleY.invert(250)});
    data.push({x:pianoScaleX.invert(0), y:pianoScaleY.invert(250)});
    */
      data.unshift({x:pianoScaleX.invert(630), y:pianoScaleY.invert(170)});
      //data.unshift(data[data.length - 1]);
      data.push({x:pianoScaleX.invert(550), y:pianoScaleY.invert(170)});
      data.push({x:pianoScaleX.invert(551), y:pianoScaleY.invert(170)});
    }

  //let purchases = [{ x: 0, y: 0 }, { x: 0, y: 250 }, { x: 100, y: 200 }, { x: 200, y: 180 }, { x: 300, y: 170 }, { x: 400, y: 150 }, { x: 500, y: 100 },
  //{ x: 600, y: 50 }, { x: 700, y: 30 }, { x: 800, y: 40 }, { x: 900, y: 25 }, { x: 1000, y: 100 }, { x: 1100, y: 80 }, { x: 1200, y: 120 }, { x: 1200, y: 0 }, { x: 0, y: 0 }];
  // console.log(data);

  // const curve = d3.line().curve(d3.curveNatural);
  let lineFn = d3.line()
    .y(d => pianoScaleX(d.x))
    .x(d => pianoScaleY(d.y))
    // .curve(d3.curveBundle.beta(1))
    .curve(d3.curveCatmullRom.alpha(1));
  // .curve(d3.curveNatural);

    let curveSelection = d3.select('#curve').selectAll('path');
    if(curveSelection.size() == 0){
      d3.select('#curve').append('path')
      .transition().duration(1000)
      // .style('fill', 'steelblue')
      // .style('stroke', 'black')
      .attr('class', 'salesCurve')
      .attr('d', lineFn(data));
    } else {
      curveSelection
      .transition().duration(1000)
      // .style('fill', 'steelblue')
      // .style('stroke', 'black')
      .attr('class', 'salesCurve')
      .attr('d', lineFn(data));
    }

    d3.select('body').append('div').attr('id', 'tooltipParent');

  let Tooltip = d3.select('#tooltipParent')
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

   // Three function that change the tooltip when user hover / move / leave a cell
   let mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("stroke-width", 0)
      .attr('r', 5)
      .style("opacity", 1)
      .style("margin", "auto");
  }
  let mousemove = function(d) {
    Tooltip
      .html('Year: ' + d.x + '<br>Number Sold: ' + d.y)
      .style("left", (d3.mouse(this)[0]+20) + "px")
      .style("top", (d3.mouse(this)[1] + 150) + "px")
  }
  let mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
     d3.select(this)
     .attr('r', 10)
     .style("opacity", 0)
       .style("stroke-width", 0)
    //   .style("opacity", 0.8)
  }
  
    /*
  //d3.select('#curve').select('path').remove(); //Gets rid of the old line if there was one.
  let curveLine = d3.select('#curve').append('path')
    .style('fill', 'steelblue')
    .style('stroke', 'black')
    .attr('d', lineFn(data));
    */

    //Axis labels.
    d3.select('#x-axis-text').remove();
    d3.select('#y-axis-text').remove();
    d3.select('#piano-viz').append('text').attr('id', 'x-axis-text').text('Number Sold').style('font-family', 'Arial').attr('x', 60).attr('y', 670);
    d3.select('#piano-viz').append('text').attr('id', 'y-axis-text').text('Year').style('font-family', 'Arial').attr('transform', 'translate(10,330)rotate(270)');

  let xAxis = d3.axisRight().scale(pianoScaleX);
  if(d3.select('#x-axis').size() == 0){
    d3.select('#piano-viz').append('g').attr('id', 'x-axis').style('font-family', 'Arial').attr("transform", "translate(190, 0)").call(xAxis);
  }

  let yAxis = d3.axisBottom().scale(pianoScaleY).ticks(3);
  if(d3.select('#y-axis').size() == 0){
    d3.select('#piano-viz').append('g').attr('id', 'y-axis').attr("transform", "translate(20, 635)").call(yAxis);
  }

  let circles = d3.select('#timeline-viz');
  if(circles.size() == 0){
    d3.select('#piano-viz').append('g').attr('id', 'timeline-viz').attr('transform', 'translate(10,0)');
  }
  

    let filteredTimeline = [];
    for(let object of timeline){
      if(object.Name == name){
        filteredTimeline.push(object);
      }
    }

    

    d3.select('#timeline-viz').selectAll('line')
      .data(timeline)
      .join('line')
      .attr('x1', 180)
      .attr('x2', 250)
      .attr('y1', d => pianoScaleX(d.Year))
      .attr('y2', d => pianoScaleX(d.Year))
      .attr('stroke', 'gray')
      .attr('opacity', function(d,i){
              if(d.Show === 'TRUE'){
              return 1;
            }
            else{
              return 0;
            }});

    d3.select('#data-points').remove();
    d3.select('#piano-viz').append('g').attr('transform', 'translate(20,0)').attr('id', 'data-points').selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cy', d => pianoScaleX(d.x))
    .attr('cx', d => pianoScaleY(d.y))
    .attr('r' , 10)
    .attr('fill', 'skyblue')
    .attr('stroke-width', 0)
    .attr('stroke', 'black')
    .style("opacity", 0)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  let selection = d3.select('#timeline-viz').selectAll('circle').data(timeline);

  let newCircles = selection.enter().append('circle')
    .attr('cy', -20)
    .attr('cx', 170 + 10)
    .attr('r', 4)
    .attr('class', function(d,i){
            if(d.Show == 'TRUE'){
            return 'event-point-show';
          }
          else{
            return 'event-point';
          }})
    .on('mouseover', (d,i,g) => {
      d3.select(g[i]).classed('event-point-hover', true)})
    .on('mouseleave', (d,i,g) => {
      d3.select(g[i]).classed('event-point-hover', false)});

  selection.exit()
    .transition()
    .duration(2000)
    .attr('cy', 700)
    .attr('cx', 170 + 10)
    .remove();

  selection = newCircles.merge(selection);

  selection.transition()
    .duration(2000)
    .attr('cy', d => pianoScaleX(d.Year))
    .attr('cx', 180);

      console.log(d3.selectAll('.event-box-mini').size() == 0)
      /*
    //if(d3.selectAll('.event-box-mini').size() == 0){
      d3.select('#timeline-viz').selectAll('cirlce')
      .data(timeline).join('text')
      // .transition()
      // .duration(2000)
      // .selectAll('tspan')
      .attr('y', d => pianoScaleX(d.Year) + 5)
      .attr('x', 225)
      .attr('dy', '.71em')
      .style('font-family', 'Arial')
      .attr('class', 'event-box-mini')
      .text(function(d,i){
            if(d.Show == 'TRUE'){
            return d.ShortText;
          }
          else{
            return null;
          }})
      .call(wrap, 200);
      //}
      */

    // var height = txt.node().getBBox().height + 15

    d3.select('#timeline-viz').selectAll('rect')
    .data(timeline).join('rect')
    .attr('x', 220)
    .attr('y', d => pianoScaleX(d.Year) - 10)
    .attr('height', 60)
    .attr('width', 203)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('class', function(d,i){
          if(d.Show == 'TRUE'){
          return 'text-rect';
        }
        else{
          return 'text-rect-hide';
        }});
    // .attr('height', height);
        
    if(d3.selectAll('.event-box-mini').size() == 0){
      d3.select('#timeline-viz').selectAll('cirlce')
      .data(timeline).join('text')
      // .transition()
      // .duration(2000)
      // .selectAll('tspan')
      .attr('y', d => pianoScaleX(d.Year) + 5)
      .attr('x', 225)
      .attr('dy', '.71em')
      .style('font-family', 'Arial')
      .attr('class', 'event-box-mini')
      .text(function(d,i){
            if(d.Show == 'TRUE'){
            return d.ShortText;
          }
          else{
            return null;
          }})
      .call(wrap, 200);
      }
      

    if(data.length == 0){
      let selection = d3.select('#piano-viz').select('#no-data-text');
      // console.log('selection size is: ' + selection.size());
      if (selection.size() == 0){
        d3.select('#piano-viz').append('text')
        .attr('id', 'no-data-text')
        .text('No purchase data available')
        .attr('y', 0)
        .attr('x', 10)
        .style('font-size', 15)
        .attr('transform', 'translate(10,640)rotate(270)');
      }      
    } else {
      d3.select('#no-data-text').remove();
    }

}

async function loadTree() {
  
  pianoData([], '');

  //Load tree data
  d3.json('./data/piano_history.json').then(treeData => {
    let tree = new Tree(treeData);
    tree.buildTree();
    tree.renderTree();
  })
}
//});

// function came from stack overflow: https://stackoverflow.com/questions/24784302/wrapping-text-in-d3
function wrap(text, width) {
  text.each(function () {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0, //parseFloat(text.attr("dy")),
          tspan = text.text(null)
                      .append("tspan")
                      .attr("x", x)
                      .attr("y", y)
                      .attr("dy", dy + "em");
      while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan")
                          .attr("x", x)
                          .attr("y", y)
                          .attr("dy", ++lineNumber * lineHeight + dy + "em")
                          .text(word);
          }
      }
  });
}


/**
 * A file loading function or CSVs
 * @param file
 * @returns {Promise<T>}
 */
async function loadFile(file) {
  let data = await d3.csv(file).then(d => {
    let mapped = d.map(g => {
      for (let key in g) {
        let numKey = +key;
        if (numKey) {
          g[key] = +g[key];
        }
      }
      return g;
    });
    return mapped;
  });
  return data;
}
/*
async function loadData() {
  let pianosales = await loadFile('data/piano_sales.csv');
  let timeline = await loadFile('data/timeline.csv');
  

  return {
    'sales': pianosales,
    'timeline': timeline
  };
*/
loadTree();
