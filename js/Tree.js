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
        this.assignLevel(this.nodeArray[0], 0);
        //this.assignPosition();
        this.assignPosition(this.nodeArray[0], 0);

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
     */
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

    /**
     * Function that renders the tree
     */
    renderTree() {
        //let svgHTML = document.createElement('svg');
        let svgHTML = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgHTML.setAttribute("width", "1200");
        svgHTML.setAttribute("height", "400");
        svgHTML.setAttribute("id", "tree-chart")
        let bodyHTML = document.getElementsByTagName("body")[0];
        bodyHTML.appendChild(svgHTML);
        let svg = d3.select("#tree-chart");

        // Lines
        svg.selectAll("line")
            .data(this.nodeArray)
            .enter().append("line")
            .attr("y1", (d, i) => d.position * 40 + 30)
            .attr("y2", function (d, i) {
                if (d.parentNode === null) {
                    // console.log('parent is null');
                    return 40;
                }
                return d.parentNode.position * 40 + 30;
            })
            .attr("x1", (d, i) => d.level * 200 + 10)
            .attr("x2", function (d, i) {
                if (d.parentNode === null) {
                    return 50;
                }
                return d.parentNode.level * 200 + 10;
            });

        let g = svg.selectAll("g")
            .data(this.nodeArray)
            .enter().append("g")
            .attr("class", "nodeGroup")
        //.attr("tranform", ((d, i) => "translate(" + (d.level * 120 + 50) + ", " + (d.position * 120 + 50) + ")"));  // scale(1,-1)")); //tranlate(150, 150)
        //.attr("tranform", "translate(200 200) rotate(90)");
            
        g.append("rect")
            .data(this.nodeArray)
            .attr("y", (d, i) => d.position * 40 + 15)
            .attr("x", (d, i) => d.level * 200 + 10)
            .attr("width", 180)
            .attr("height", 30)
            .attr('class', 'tree-rect')
            .attr('fill', function(d){
                    if(d.dataAvailable == "true"){
                        console.log('data available');
                        return 'white';
                    } else {
                        return 'lightgrey';
                    }
            })
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
              });

        g.append("text")
            .data(this.nodeArray)
            .text((d, i) => "\u00A0\u00A0\u00A0" + d.name)
            .attr("y", (d, i) => d.position * 40 + 35)
            .attr("x", (d, i) => d.level * 200 + 10)
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
        console.log('formatted name is: ' + formattedName);
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

// function piano() {
//     let pianokeys = Array.from(Array(50).keys());
//     let piano = d3.select('#piano').selectAll('rect')
//         .data(pianokeys)
//         .join('rect')
//         .attr('x', d => d * 20)
//         .attr('width', d => d * 20 + 20)
//         .attr('height', 50)
//         .style('fill', 'white')
//         .style('stroke', 'black');
// }
// piano();
