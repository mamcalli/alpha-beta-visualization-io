import './styles.css'
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const TreeDiagram = ({ treeData, currentStep, alphaBetaValues }) => {
    const svgRef = useRef();

    // State to keep track of window dimensions
    // const [dimensions, setDimensions] = useState({
    //     width: window.innerWidth-100,
    //     height: window.innerHeight-100
    // });

    useEffect(() => {
        // Clear any previous visualization in the SVG
        d3.select(svgRef.current).selectAll('*').remove();

        console.log("TreeDiagram useEffect triggered");
        console.log("Current Step:", currentStep);


        const svg = d3.select(svgRef.current)
          .attr('width', window.innerWidth-100)
          .attr('height', window.innerHeight-100);

        // Set up the D3 tree layout
        const root = d3.hierarchy(treeData); // Convert the treeData into a D3 hierarchy

        // const depth = root.height; 
        // const verticalSpacing = Math.min(100, (dimensions.height / (depth + 1)));
        // const treeLayout = d3.tree().size([dimensions.width - 100, verticalSpacing * depth]);
        const treeLayout = d3.tree().size([window.innerWidth-200, window.innerHeight-200]);
        // const root = d3.hierarchy(treeData); // Convert the treeData into a D3 hierarchy
        treeLayout(root);

        // Create an SVG selection
        // const svg = d3.select(svgRef.current);

        const g = svg.append('g')
            .attr('transform', 'translate(0,50)');

        // const link = g.selectAll('.link')
        // Render the links (edges) of the tree
        const link = g.selectAll('.link')
            .data(root.descendants().slice(1))
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', d => `M${d.x},${d.y}C${d.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${d.parent.y}`);

        // Render the nodes of the tree as triangles
        const node = g.selectAll('.node')
            .data(root.descendants())
            .enter().append('g')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .attr('class', 'node');


        node.append('path')
            .attr('d', d3.symbol().type(d3.symbolTriangle).size(500))
            .attr('stroke', 'black')
            // .attr('transform', d => `translate(${d.x},${d.y})`)
            .attr('fill', d => {
                // if (currentStep) {
                //     console.log("Current Step Node:", currentStep.node)
                //     console.log("d", d)

                // }
                if (d.data.isPruned) {
                    return 'grey';
                }
                if (currentStep && currentStep.node === d.data) {
                    console.log("Highlighting node green:", d.data.value);
                    return 'green';  // Highlight the current node in green
                }
                return d.depth % 2 === 0 ? 'DodgerBlue' : 'red';
            })
            .attr('stroke-width', 1)
            .attr('transform', d => d.depth % 2 === 0 ? 'rotate(0)' : 'rotate(180)');

        const xLine1 = g.selectAll('.xLine1')
            .data(root.descendants().filter(d => d.data.isPruned))
            .enter().append('line')
            .attr('x1', d => d.x - 10)
            .attr('y1', d => d.y - 10)
            .attr('x2', d => d.x + 10)
            .attr('y2', d => d.y + 10)
            .attr('stroke', 'black')
            .attr('stroke-width', 1);

        const xLine2 = g.selectAll('.xLine2')
            .data(root.descendants().filter(d => d.data.isPruned))
            .enter().append('line')
            .attr('x1', d => d.x - 10)
            .attr('y1', d => d.y + 10)
            .attr('x2', d => d.x + 10)
            .attr('y2', d => d.y - 10)
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
            // .attr('fill', d => (currentStep && currentStep.action === 'prune' && (d === currentStep.node || d.descendants().includes(currentStep.node))) ? 'gray' : 'black');

        // Add labels to the nodes (if they have values)
        node.append('text')
          .attr('dy', 3)
          .attr('y', d => d.children ? -30 : 30)
          .style('text-anchor', 'middle')
          .text(d => d.data.value);


        const alphaBetaDisplay = svg.append('g')
            .attr('class', 'alpha-beta-display')
            .attr('transform', `translate(${window.innerWidth - 220}, 30)`);

        alphaBetaDisplay.append('text')
            .text(`Alpha: ${alphaBetaValues.alpha}`)
            .attr('class', 'alpha-beta-text')
            .attr('y', 0);

        alphaBetaDisplay.append('text')
            .text(`Beta: ${alphaBetaValues.beta}`)
            .attr('class', 'alpha-beta-text')
            .attr('y', 20);

    }, [treeData, currentStep, alphaBetaValues]);  // Re-render when treeData or currentStep changes or dimensions change

    return (
        <svg ref={svgRef}></svg>
    );
}

export default TreeDiagram;

