/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
        //Create a list nodes. Save node name and parent in each node.
        this.nodeArray = []
        for(let currentJson of json){
            let testNode = new Node(currentJson.name, currentJson.parent);
            this.nodeArray.push(testNode);
        }
        console.log(this.nodeArray);
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
        //add parentNode and children to each Node.
        for(let currentNode of this.nodeArray){
            if(currentNode.parent === 'root'){
                currentNode.parentNode = null;
            } else {
                for(let possibleParent of this.nodeArray){
                    //console.log("currentNode.parent: " + currentNode.parent + "possibleParent.name: " + possibleParent.name);
                    if(currentNode.parentName == possibleParent.name){
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
        for(let childNode of node.children){
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
        for(let childNode of node.children){
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
        let svgHTML = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svgHTML.setAttribute("width", "1200");
        svgHTML.setAttribute("height", "1200");
        let bodyHTML = document.getElementsByTagName("body")[0];
        bodyHTML.appendChild(svgHTML);
        let svg = d3.select("svg");

        // Lines
        svg.selectAll("line")
            .data(this.nodeArray)
            .enter().append("line")
            .attr("y1", (d, i) => d.position * 120 + 50)
            .attr("y2", function(d,i){
                if(d.parentNode === null){
                    console.log('parent is null');
                    return 50;
                }
                return d.parentNode.position * 120 + 50;
            }) 
            .attr("x1", (d, i) => d.level * 120 + 50)
            .attr("x2", function(d, i){
                if(d.parentNode === null){
                    return 50;
                }
                return d.parentNode.level * 120 + 50;
            });
            
        let g = svg.selectAll("g")
            .data(this.nodeArray)
            .enter().append("g")
            .attr("class", "nodeGroup")
            //.attr("tranform", ((d, i) => "translate(" + (d.level * 120 + 50) + ", " + (d.position * 120 + 50) + ")"));  // scale(1,-1)")); //tranlate(150, 150)
            //.attr("tranform", "translate(200 200) rotate(90)"); 

            g.append("circle")
            .data(this.nodeArray)
            //.enter().append("circle")
            .attr("cy", (d, i) => d.position * 120 + 50)
            .attr("cx", (d, i) => d.level * 120 + 50)
            .attr("r", 60);

            g.append("text")
            .data(this.nodeArray)
            //.enter().append("text")
            .text((d, i) => d.name)
            .attr("y", (d, i) => d.position * 120 + 50)
            .attr("x", (d, i) => d.level * 120 + 50)
            .attr("class", "label");
    }

}

function piano(){
    let pianokeys = Array.from(Array(50).keys());
    let piano = d3.select('#piano').selectAll('rect')
    .data(pianokeys)
    .join('rect')
    .attr('x', d => d*20)
    .attr('width', d => d*20 + 20)
    .attr('height', 50)
    .style('fill', 'white')
    .style('stroke', 'black');
  }
  piano();