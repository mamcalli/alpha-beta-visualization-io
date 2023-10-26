import React, { useState } from 'react';
import TreeDiagram from '../components/TreeDiagram';

import { max } from 'd3';  // Though not used, keeping it as it might be needed in future expansions

// Define alpha-beta pruning generator function
function* alphaBetaGenerator(node, alpha, beta, isMaxPlayer) {
    // Base case: Node doesn't have children, is leaf node
    if (!node.children || node.children.length === 0) {
        yield { action: 'returning value', node: node, value: node.value };  // Yield the value of the leaf node
        return node.value;
    }
    // if max turn
    if (isMaxPlayer) {
        let max_val = -Infinity;
        // iterate though children node
        for (let child of node.children) {
            // recursively call alpha beta using yield* for generator delegation
            let val = yield* alphaBetaGenerator(child, alpha, beta, false);
            max_val = Math.max(max_val, val);
            alpha = Math.max(alpha, val);
            yield { action: 'update', alpha: alpha, node: node, value: max_val };  // Yield update action
            // Alpha-beta pruning condition for maximizing player
            if (beta <= alpha) {
                for (let subsequentChild of node.children.slice(node.children.indexOf(child) + 1)) {
                    subsequentChild.isPruned = true;
                }
                yield { action: 'prune', node: child };
                break;
            }
        }
        node.value = max_val;
        yield { action: 'updateValue', node: node, value: max_val };
        return max_val;

    } else {
        let min_val = Infinity;
        // Iterate over all children nodes
        for (let child of node.children) {
        // Recursively call the generator for the child node
            let val = yield* alphaBetaGenerator(child, alpha, beta, true);
            min_val = Math.min(min_val, val);
            beta = Math.min(beta, val);
            yield { action: 'update', node: node, value: min_val };  // Yield update action
            if (beta <= alpha) {
                for (let subsequentChild of node.children.slice(node.children.indexOf(child) + 1)) {
                    subsequentChild.isPruned = true;
                }
                yield { action: 'prune', node: child };
                break;
            }
        }
        node.value = min_val;
        yield { action: 'updateValue', node: node, value: min_val };
        return min_val;
    }
}

export default alphaBetaGenerator;
