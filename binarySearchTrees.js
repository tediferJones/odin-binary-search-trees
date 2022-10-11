
function buildTree(sorted) {
  if (sorted.length === 0) {
    return null;
  }
  // list needs to be sorted, then pick middle value, thats ur root value
  let root = nodeClass(sorted[Math.floor(sorted.length / 2)]);
  // take left side of the list, find its middle value, thats ur left value for root
  root.left = buildTree(sorted.slice(0, Math.floor(sorted.length / 2)));
  // take right side of the list, find its middle value, thats ur right value for root
  root.right = buildTree(sorted.slice(Math.floor(sorted.length / 2) + 1));

  // repeat recurssively until start > end, then return null
  return root;
}

function nodeClass(value, left=null, right=null) {
  return {
    value,
    left,
    right
  }
}

function treeClass(arr) {
  return {
    root: buildTree([...new Set(arr.sort(function(a,b){ return a-b }))]), // sorts the array in ascedning order and removes duplicate values;
    insert(value, currentNode=this.root) {
      // insert adds a leaf to tree, dont change the current order of nodes, just add to end where it would fit
      if (value === currentNode.value) {
        return 'Value already exists'
      } else if (value < currentNode.value) {
        // go down left tree
        if (currentNode.left === null) {
          return currentNode.left = nodeClass(value);
        }
        return this.insert(value, currentNode.left);
      } else if (value > currentNode.value) {
        // go down right tree
        if (currentNode.right === null) {
          return currentNode.right = nodeClass(value);
        }
        return this.insert(value, currentNode.right);
      }
    },
    delete(value, currentNode=this.root) {
      // THIS METHOD WONT WORK FOR ROOT NODES

      // there are 3 cases for delete
      // 1.) the node has no children, just make the parent node point to null instead of that node
      // 2.) the node has 1 child, make parent of node, point to child of node
      // 3.) the node has 2 children, find the next largest number after node.value, (go right onces, then go left until null, last value of this left tree is next greatest), replace current node, with that node.
      // with an if else chain statement, order should be 3, 2, 1

      // steps to delete an item
      // 1.) find the parent of the node whose value is the desired value
      //    - function findparent(value, currentNode)
      //      - if (parent.left.value === value || parent.right.value === value) return parent
      //      - else advance the node, if value < parent search parent.left, else search parent.right
      // 2.) analyze the grandchildren, determine method
      //      - node = the node with desired value
      //      - if 2 children, see method#3
      //      - if 1 left child, parent.left = parent.node.left
      //      - if 1 right child, parent.right = parent.node
      // 3.) execute removal
      // try to perform these steps in order


      function findParentNode(value, currentNode) {
        // returns the parent of the node with the desired value
        if (currentNode.left.value === value || currentNode.right.value === value) {
          // one of the children has the correct value, return the currentNode
          return currentNode;
        } else if (!currentNode.left === null || currentNode.right === null) {
          // this node has no children, so if it hasnt already been found, it doesnt exist
          return 'value not found'
        } else {
          // traverse the tree according to the value
          if (value < currentNode.value) {
            // console.log('going left')
            return findParentNode(value, currentNode.left)
          } else if (value > currentNode.value) {
            // console.log('going right')
            return findParentNode(value, currentNode.right)
          } else {
            return 'something has gone terribly wrong'
          }
        }
      }
      // if (value === currentNode.value) {
        // desiredNode is the currentNode
      // }
      let parent = findParentNode(value, currentNode);
      let desiredNode = null;
      if (value < parent.value) {
        desiredNode = parent.left
      } else {
        desiredNode = parent.right
      }

      // determine the strat and execute changes
      if (desiredNode.left && desiredNode.right) {
        // method #3, desiredNode has 2 children
        let nextGreatestNode = desiredNode.right;
        while (nextGreatestNode.left) {
          nextGreatestNode = nextGreatestNode.left
        }
        this.delete(nextGreatestNode.value);
        desiredNode.value = nextGreatestNode.value

      } else if (desiredNode.left || desiredNode.right) {
        // method #2, desiredNode has 1 child
        childNode = desiredNode.left || desiredNode.right;
        if (desiredNode.value < parent.value) {
          parent.left = childNode;
        } else {
          parent.right = childNode;
        }
      } else {
        // method #1, desiredNode has no children
        if (value < parent.value) {
          parent.left = null;
        } else {
          parent.right = null;
        }
      }
      return
    },
    find(value, currentNode = this.root) {
      if (currentNode === null) {
        return 'Value not found'
      }

      if (value === currentNode.value) {
        return currentNode
      } else if (value < currentNode.value) {
        currentNode = currentNode.left;
        return this.find(value, currentNode);        
      } else if (value > currentNode.value) {
        currentNode = currentNode.right;
        return this.find(value, currentNode);
      }
    },
    levelOrder() {
      // this is gunna be a cluster
      // levelOrder function should be able to take another function as a parameter
      // then test each value in the tree against said function
    }
  }
}

// stolen from odin project page
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
}

// y = treeClass([7,6,5,4,2,1]);
// prettyPrint(y.root);

x = treeClass([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 25, 6000]);
prettyPrint(x.root);
// console.log(x.delete(6000))
// console.log(x.delete(25))
// console.log(x.delete(5))
console.log(x.find(6345))
// prettyPrint(x.root);
