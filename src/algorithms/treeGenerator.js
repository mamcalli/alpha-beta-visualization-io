function generateRandomTree(depth, isMaxPlayer=true) {

    if (depth === 0) {
        return {
            name: "test",
            value: Math.floor(Math.random() * 100) // Random value for leaf nodes.
        };
    }
    
    if (depth === 1) {
        var numChildren = 2 + Math.floor(Math.random() * 2); // Between 2 and 4 children.
    } else {
        var numChildren = 2 + Math.floor(Math.random() * 2); // Between 2 and 4 children.
    }

    let children = [];
    
    for (let i = 0; i < numChildren; i++) {
        children.push(generateRandomTree(depth - 1, !isMaxPlayer));
    }


    // console.log(children);
    return {
        isMaxPlayer: isMaxPlayer,
        children: children
    };
}

export default generateRandomTree;
