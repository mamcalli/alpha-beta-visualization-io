
import React, { useState, useRef } from 'react';  // Added useRef hook
import TreeDiagram from './components/TreeDiagram';
import alphaBetaGenerator from './algorithms/alphaBeta';
import generateRandomTree from './algorithms/treeGenerator';
import './App.css';

function AlphaBetaVisualization() {
    // const [tree] = useState(generateRandomTree(3));
    const [tree, setTree] = useState(generateRandomTree(3)); // ADDED

    const [currentStep, setCurrentStep] = useState(null);

    const [initialTree, setInitialTree] = useState(JSON.parse(JSON.stringify(tree)));

    // useEffect(() => {
    //     setInitialTree(JSON.parse(JSON.stringify(tree)));
    // }, []); // ADDED

    // Use useRef to maintain the alphaBetaGen instance across renders
    const alphaBetaGenRef = useRef(alphaBetaGenerator(tree, -Infinity, Infinity, true));

    const handleNextStep = () => {
        console.log("handleNextStep triggered");
        const step = alphaBetaGenRef.current.next();
        if (step.done) {
            console.log("Alpha-beta pruning has completed.");
            return;
        }
        console.log("Received step from generator:", step);
        if (!step.done) {
            setCurrentStep(step.value);
        }

        if (step.value.action === 'updateValue') {
            // Find the node in the tree and update its value
            const updateNodeValue = (node, targetNode, newValue) => {
                if (node.value === targetNode.value) {
                    node.value = newValue;
                    return true;
                }
                return node.children && node.children.some(child => updateNodeValue(child, targetNode, newValue));
            };
            updateNodeValue(tree, step.value.node, step.value.value);
        }

    };

    // const handleReset = () => {
    //     console.log("handleReset triggered");
    //     // setCurrentStep(null);
    //     // alphaBetaGenRef.current = alphaBetaGenerator(tree, -Infinity, Infinity, true);
    //     // ADDED :
    //     setTree(JSON.parse(JSON.stringify(initialTree)));
    //     setCurrentStep(null);
    //     alphaBetaGenRef.current = alphaBetaGenerator(tree, -Infinity, Infinity, true);
    // };

    const handleReset = () => {
        console.log("handleReset triggered");
        setTree(JSON.parse(JSON.stringify(initialTree)));  // Reset tree to its initial state
        setCurrentStep(null);
        alphaBetaGenRef.current = alphaBetaGenerator(initialTree, -Infinity, Infinity, true);
    };
    
    return (
        <div className="App">
            <TreeDiagram treeData={tree} currentStep={currentStep} />
            <button onClick={handleNextStep}>Next Step</button>
            <button onClick={handleReset}>Reset</button>
        </div>
    );
}


export default AlphaBetaVisualization;
