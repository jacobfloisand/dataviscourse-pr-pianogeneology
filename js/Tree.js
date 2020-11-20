/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor (json) {
        //Create a list nodes. Save node name and parent in each node.
        this.nodeArray = []
        for (let currentJson of json) {
            let testNode = new Node(currentJson.name, currentJson.parent);
            testNode.dataAvailable = currentJson.dataAvailable;
            testNode.isSelected = "false";
            this.nodeArray.push(testNode);
        }
        this.currentlySelectedIndex = 0;
        console.log(this.nodeArray);
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
        //add parentNode and children to each Node.
        for (let currentNode of this.nodeArray) {
            if (currentNode.parent === 'root') {
                currentNode.parentNode = null;
            } else {
                for (let possibleParent of this.nodeArray) {
                    //console.log("currentNode.parent: " + currentNode.parent + "possibleParent.name: " + possibleParent.name);
                    if (currentNode.parentName == possibleParent.name) {
                        currentNode.parentNode = possibleParent;
                        possibleParent.children.push(currentNode);

                    }

                }
            }
        }

        console.log(this.nodeArray)
        this.assignLevel(this.nodeArray[0], 0); //top to bottom
        //this.assignPosition();
        this.assignPosition(this.nodeArray[0], 4, 0, 8); //left to right

    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        node.level = level;
        for (let childNode of node.children) {
            this.assignLevel(childNode, level + 1);
        }

    }

    /**
     * Recursive function that assign positions to each node
     
    assignPosition(node, position) {
        node.position = position;
        let originalPosition = position;
        position = position - 1;
        //let childPosition = 0
        for (let childNode of node.children) {
            position = position + 1;
            position = this.assignPosition(childNode, position);

        }
        return Math.max(position, originalPosition);
    }
    */
   
    assignPosition(node, position, minPosition, maxPosition) {
        node.position = position;
        let originalPosition = position;
        let numChildren = node.children.length;
        let range = maxPosition - minPosition;
        let spacing = range / numChildren;
        //console.log(numChildren);
        let childNum = 0;
        for (let childNode of node.children) {
            position = minPosition + (spacing * childNum) + spacing/2;
            //console.log(position);
            this.assignPosition(childNode, position, minPosition + (spacing * childNum), minPosition + (spacing * childNum) + spacing);
            childNum = childNum + 1;
        }
    }
    

    /**
     * Function that renders the tree
     */
    renderTree() {
        //let svgHTML = document.createElement('svg');
        //let svgHTML = document.createElementNS("http://www.w3.org/2000/svg", "svg").append('g').attr('transform', 'translate(300,0)');
        //svgHTML.setAttribute("width", "1200");
        //svgHTML.setAttribute("height", "400");
        // svgHTML.setAttribute("id", "tree-chart")
        //let bodyHTML = document.getElementsByTagName("body")[0];

        let svg = d3.select('#piano-viz').append('g').attr('transform', 'translate(325,0)');
        //let svg = d3.select("#tree-chart");
        //const curve = d3.line().curve(d3.curveNatural);
        var Gen = d3.line() 
            .x((p) => p.x) 
            .y((p) => p.y) 
            .curve(d3.curveCatmullRom.alpha(1));
        svg.selectAll("path")
            .data(this.nodeArray)
            .enter().append("path")
            .attr('stroke', 'gray')
            .attr('d', function (d) {
                if(d.parentNode === null){
                    let points = [{x:d.position * 130 + 50 , y:d.level * 63 + 30} , 
                                  {x:d.position * 130 + 50 , y:d.level * 63 + 30} ,
                                  {x:d.position * 130 + 50 , y:d.level * 63 + 30} ,  
                                  {x:d.position * 130 + 50 , y:d.level * 63 + 30}];
                    return Gen(points)
                } else {
                    let points = [{x:d.position * 130 + 50 , y:d.level * 63 + 15} ,
                                  {x:d.position * 130 + 50 , y:d.level * 63 + 14} , 
                                  {x:d.parentNode.position * 130 + 50 , y:d.parentNode.level * 63 + 10.1} ,
                                  {x:d.parentNode.position * 130 + 50 , y:d.parentNode.level * 63 + 10}]
                    return Gen(points)
                }
            }).attr('fill', 'none')
            //.attr('d', 5);
            
        // Lines
        /*
        svg.selectAll("line")
            .data(this.nodeArray)
            .enter().append("line")
            .attr("x1", (d, i) => d.position * 115 + 50)
            .attr("x2", function (d, i) {
                if (d.parentNode === null) {
                    // console.log('parent is null');
                    return d.position * 115 + 50;
                }
                return d.parentNode.position * 115 + 50;
            })
            .attr("y1", (d, i) => d.level * 75 + 30)
            .attr("y2", function (d, i) {
                if (d.parentNode === null) {
                    return d.level * 75 + 30;
                }
                return d.parentNode.level * 75 + 30;
            });
            */

        let g = svg.selectAll("g")
            .data(this.nodeArray)
            .enter().append("g")
            .attr("class", "nodeGroup")
        //.attr("tranform", ((d, i) => "translate(" + (d.level * 120 + 50) + ", " + (d.position * 120 + 50) + ")"));  // scale(1,-1)")); //tranlate(150, 150)
        //.attr("tranform", "translate(200 200) rotate(90)");
            
        g.append("rect")
            .data(this.nodeArray)
            .attr("x", (d, i) => d.position * 130 + 15)//115 + 15)
            .attr("y", (d, i) => d.level * 63 + 10)//75 + 10)
            .attr('rx', 15)
            .attr('ry', 15)
            .attr("width", 84)//75)
            .attr("height", 40)//60)
            .attr('class', function(d){
                    if(d.dataAvailable == "true"){
                        return 'tree-rect-select';
                    } else {
                        return 'tree-rect';
                    }
            })
            .on('mouseover', (d, i, g) => {
                if(d.dataAvailable == "true"){
                    d3.select(g[i]).classed('hovered', true);
                }
              })
              .on('mouseout', (d, i, g) => {
                if(d.dataAvailable == "true"){
                    d3.select(g[i]).classed('hovered', false);
                }
              })
              .on("click", (d, i, g) => {
                  if(d.dataAvailable == "true"){
                        d3.select(g[this.currentlySelectedIndex]).classed('selected', false);
                        d3.select(g[this.currentlySelectedIndex]).classed('tree-rect', true);
                        d3.select(g[i]).classed('tree-rect', false);
                        d3.select(g[i]).classed('selected', true);
                        this.currentlySelectedIndex = i;
                        console.log(this.nodeArray[i]);
                        this.getData(this.nodeArray[i].name);
                  }
              });

        g.append("text")
            .data(this.nodeArray)
            .attr("x", (d, i) => d.position * 130 + 16)//100 + 15)
            .attr("y", (d, i) => d.level * 63 + 28)//50 + 10)
            .attr("class", "tree-chart-label")
            .on('mouseover', (d, i, g) => {
                if(d.dataAvailable == "true"){
                    d3.select(g[i]).classed('hovered', true);
                }
              })
              // .on('click', playSound('coin'))
              .on('mouseout', (d, i, g) => {
                if(d.dataAvailable == "true"){
                    d3.select(g[i]).classed('hovered', false);
                }
              })
              .on("click", (d, i, g) => {
                if(d.dataAvailable == "true"){
                    d3.select(g[this.currentlySelectedIndex]).classed('selected', false);
                    d3.select(g[this.currentlySelectedIndex]).classed('tree-rect', true);
                    d3.select(g[i]).classed('tree-rect', false);
                    d3.select(g[i]).classed('selected', true);
                    this.currentlySelectedIndex = i;
                    console.log(this.nodeArray[i]);
                    this.getData(this.nodeArray[i].name);
                }
            })
            .attr('dy', '.71em')
            .style('font-family', 'Arial')
            .text((d, i) => "\u00A0\u00A0\u00A0" + d.name)
            .attr('font-size', 13)
            .call(this.wrap, 85);
            
    }

    // function came from stack overflow: https://stackoverflow.com/questions/24784302/wrapping-text-in-d3
wrap(text, width) {
    //console.log('inside wrap function')
    text.each(function () {
        //console.log('text.text is: ' + d3.select(this).text())
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
                        words.pop();
        while (word = words.pop()) {
            //console.log('inside while loop')
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                //console.log('inside while loop');
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
  }

    getData(pianoName){
        let formattedName = '';
        if(pianoName == "Modern upright piano"){
            formattedName = 'VERTICAL PIANOS';
        }
        if(pianoName == "Grand Piano"){
            formattedName = 'GRAND PIANOS';
        }
        if(pianoName == "Electric Piano"){
            formattedName = 'ELECTRONIC';
        }
        if(pianoName == "Player Piano"){
            formattedName = 'PNEUMATIC PLAYERS';
        }
        //console.log('formatted name is: ' + formattedName);
        if(formattedName == ''){
            pianoData([], pianoName);
            return;
        }
        d3.csv('data/piano_sales.csv').then(d => {
            console.log(d);
            let mapped = d.map(g => {
                if(g[formattedName] == '' || g[formattedName] == '(3 Months)'){
                    return null;
                }
                return {x:parseInt(g['YEAR']), y:parseInt(g[formattedName].replace(/,/g, ''))};
              });
              console.log('finished mapping');
              mapped = mapped.filter(function (el) {
                return el != null;
              });
              pianoData(mapped, pianoName);
          });
    }

}


//Load tree data
d3.json('./data/piano_history.json').then(treeData => {
    let tree = new Tree(treeData);
    tree.buildTree();
    tree.renderTree();
  })