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
      .domain([1400, 2007])
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
      data.unshift({x:pianoScaleX.invert(1200), y:pianoScaleY.invert(170)});
      //data.unshift(data[data.length - 1]);
      data.push({x:pianoScaleX.invert(1038), y:pianoScaleY.invert(170)});
      data.push({x:pianoScaleX.invert(1037), y:pianoScaleY.invert(170)});
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
      .style('fill', 'steelblue')
      .style('stroke', 'black')
      .attr('d', lineFn(data));
    } else {
      curveSelection
      .transition().duration(1000)
      .style('fill', 'steelblue')
      .style('stroke', 'black')
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
  d3.select('#data-points').remove();
  d3.select('#piano-viz').append('g').attr('id', 'data-points').selectAll('circle')
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
    d3.select('#piano-viz').append('text').attr('id', 'x-axis-text').text('Number Sold').style('stroke', 'black').attr('x', 60).attr('y', 670);
    d3.select('#piano-viz').append('text').attr('id', 'y-axis-text').text('Year').style('stroke', 'black').attr('transform', 'translate(10,330)rotate(270)');

  let xAxis = d3.axisRight().scale(pianoScaleX);
  d3.select('#x-axis').remove();
  d3.select('#piano-viz').append('g').attr('id', 'x-axis').attr("transform", "translate(190, 5)").call(xAxis);

  let yAxis = d3.axisBottom().scale(pianoScaleY).ticks(5);
  d3.select('#y-axis').remove();
  d3.select('#piano-viz').append('g').attr('id', 'y-axis').attr("transform", "translate(20, 635)").call(yAxis);

  let circles = d3.select('#timeline-viz');
  if(circles.size() == 0){
    d3.select('#piano-viz').append('g').attr('id', 'timeline-viz').attr('transform', 'translate(10,0)');
  }
  //d3.select('#timeline-viz').remove();
  

    let filteredTimeline = [];
    for(let object of timeline){
      if(object.Name == name){
        filteredTimeline.push(object);
      }
    }
    // console.log('filtered data is: ' + filteredTimeline);

  let selection = d3.select('#timeline-viz').selectAll('circle').data(filteredTimeline);

  let newCircles = selection.enter().append('circle')
    .attr('cy', -20)
    .attr('cx', 170 + 10)
    .attr('r', 10)
    // .attr('fill', '#FFA500')
    // .attr('stroke', 'black')
    .attr('class', 'event-point')
    .attr('stroke-width', '.5');

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
    .attr('cx', 170 + 10);

    // console.log('name is: ' + name);

    

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

//loadData().then(data => {
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
