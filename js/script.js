function piano(){

    

    let pianokeys = Array.from(Array(98).keys());
    let pianos = d3.select('#piano').selectAll('rect')
        .data(pianokeys)
        .join('rect')
        // .attr('x', d => d*20)
        .attr('y', 0)
        .attr('x', d => d*12)
        .attr('height', 250)
        .attr('width', 12)
        .classed('keys', true)
        .on('mouseover', (d, i, g) => {
            d3.select(g[i]).classed('hovered', true);
          })
        // .on('click', playSound('coin'))
        .on('mouseout', (d, i, g) => {
            d3.select(g[i]).classed('hovered', false);
          });

        // let blackkeys = Array.from(Array(50).keys());
        let blackkeys = [0,1,2,4,5,7,8,9,11,12,14,15,16,18,19,21,22,23,25,26,28,29,30,32,33,35,36,37,39,40,42,43,44,46,
                        47,49,50,51,53,54,56,57,58,60,61,63,64,65,67,68,70,71,72,74,75,77,78,79,81,82,84,85,86,88,89,91,92,93,95,96];
                        
        let blacks = d3.select('#blackkeys').selectAll('rect')
            .data(blackkeys)
            .join('rect')
            .attr('y', 160)
            .attr('x', d => 8 + d*12)
            .attr('height', 90)
            .attr('width', 8)
            .classed('blackkeys', true)
            .on('mouseover', (d, i, g) => {
                d3.select(g[i]).classed('hovered', true);
              })
            .on('mouseout', (d, i, g) => {
                d3.select(g[i]).classed('hovered', false);
              });

          let purchases = [{x:0, y:0}, {x:0, y:250}, {x:100, y:200}, {x:200, y:180}, {x:300, y:170}, {x:400, y:150}, {x:500, y:100}, 
                          {x:600, y:50}, {x:700, y:30}, {x:800, y:40}, {x:900, y:25}, {x:1000, y:100}, {x:1100, y:80}, {x:1200, y:120}, {x:1200, y:0}, {x:0, y:0}];
          console.log(purchases);

          // const curve = d3.line().curve(d3.curveNatural);
          let lineFn = d3.line()
                .x(d => d.x)
                .y(d => d.y)
                // .curve(d3.curveBundle.beta(1))
                .curve(d3.curveCatmullRom.alpha(1));
                // .curve(d3.curveNatural);

          let curveLine = d3.select('#curve').append('path')
              .style('fill', 'white')
              .style('stroke', 'black')
              .attr('d', lineFn(purchases));

  }
piano();