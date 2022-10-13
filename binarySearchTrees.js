
// theoretically you should be able to move this function inside the treeClass
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
    deleteV2(value, currentNode=this.root) {
      /// try to make it recursive
      if (currentNode === null) {
        return currentNode;
      }

      if (value < currentNode.value) {
        currentNode.left = this.deleteV2(value, currentNode.left)
      } else if (value > currentNode.value) {
        currentNode.right = this.deleteV2(value, currentNode.right)
      } else {
        // if you've made it this far, currentNode is what you want to delete
        if (currentNode.left && currentNode.right) {
          // method#3
          nextGreatestNode = currentNode.right;
          while (nextGreatestNode.left) {
            nextGreatestNode = nextGreatestNode.left;
          }
          this.deleteV2(nextGreatestNode.value)
          currentNode.value = nextGreatestNode.value
        } else if (currentNode.left || currentNode.right) {
          // method#2
          let temp = currentNode.left || currentNode.right;
          currentNode = temp
        } else {
          // method#1
          currentNode = null
        }
      }
      return currentNode;
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
    levelOrder(currentNode=this.root) {
      // THE ANSWER:
      // https://www.youtube.com/watch?v=H0i3gk1h0lI&ab_channel=Codevolution
      // YOU NEED TO USE A QUEUE
      // Queue example: https://jsfiddle.net/h9o7upcw/10/

      // this is gunna be a cluster
      // levelOrder function should be able to take another function as a parameter
      // then test each value in the tree against said function
      // order the values matters, go from top to bottom, and left to right, dont go down until you have processed all nodes on the same level, then procede to next level

      // consider allowing this function to take a counter as input, start at 0, examine root, counter ++, examine nodes 1 level below root, counter ++, examine all nodes 2 levels below root, etc...
      // a "print a values on currentLevel" function would be super useful
      // let left,right;
      // if (currentNode.left) {
      //   left = this.levelOrder(currentNode.left);
      // }
      // if (currentNode.right) {
      //   right = this.levelOrder(currentNode.right)
      // }

      // if node=root, add value to arr
      // if node.left, add node.left.value to arr
      // if node.right, add node.right.value to arr
      // if node.left, levelOrder(node.left)
      // if node.right, levelOrder(node.right)
      // return arr

      let arr = left = right = []
      if (currentNode === this.root) {
        arr.push(currentNode.value)
      }
      // arr.push
      // if (currentNode.left) {
      //   arr.push(currentNode.left.value);
      // }
      // if (currentNode.right) {
      //   arr.push(currentNode.right.value);
      // }

      if (currentNode.left) {
        left = this.levelOrder(currentNode.left);
      }
      if (currentNode.right) {
        right = this.levelOrder(currentNode.right);
      }
      // console.log(arr)
      console.log(currentNode.value)
      console.log(arr, left, right)
      return arr.concat(left).concat(right);


      if (currentNode) {
        arr.push(currentNode.value)
      }



    },
    inorder() {

    },
    preorder() {

    },
    postorder() {

    },
    height(node) {
      // height is the number of edges (not nodes) between this element and its furthest leaf node

      // ISSUE
      // WHEN GIVEN A NODE WITH ONLY ON CHILD, RETURNS NaN
      // MORE SPECIFICALLY, IF THE ONLY CHILD IS TO THE RIGHT, FUCKED
      // IF ONLY CHILD IS TO THE LEFT ITS FINE

      let left = right = 0;
      if(node.left === null && node.right === null) {
        return 0;
      }

      if (node.left) {
        left = this.height(node.left) + 1;
      }
      if (node.right) {
        right = this.height(node.right) + 1;
      }
      return Math.max(left, right);
    },
    depth(node, currentNode=this.root, counter=0) {
      // depth is the number of edges (not nodes) between this element and root
      if (node === currentNode) {
        return counter
      }
      if (node.value < currentNode.value) {
        counter++;
        currentNode = currentNode.left;
        return this.depth(node, currentNode, counter);
      } else if (node.value > currentNode.left) {
        counter++;
        currentNode = currentNode.right;
        return this.depth(node, currentNode, counter);
      }
    },
    isBalanced(currentNode=this.root, status=true) {
      // A balanced tree is one where the left and right nodes (of every node) have a height difference no greater than 1
      // LOOK AT GETARRAY() FOR A SIMPLE WAY TO TRAVERSE ALL NODES
      if (currentNode.left === null && currentNode.right === null) {
        return true
      }

      let leftHeight = (currentNode.left) ? this.height(currentNode.left) : 0;
      let rightHeight = (currentNode.right) ? this.height(currentNode.right) : 0;
      if (Math.abs(leftHeight - rightHeight) > 1) {
        status = false;
      }

      let left = right = true;
      if (currentNode.left) {
        left = this.isBalanced(currentNode.left, status)
      }
      if (currentNode.right) {
        right = this.isBalanced(currentNode.right, status)
      }
      // console.log('VALUE: ' + currentNode.value)
      // console.log(status,left,right)
      // console.log(`LEFT HEIGHT: ${leftHeight}`)
      // console.log(`RIGHT HEIGHT: ${rightHeight}`)
      // console.log('#################################################')

      return status && left && right
    },
    rebalance() {
      // just call getArray() and make a new tree from that

    },
    getArray(currentNode=this.root) {
      if (!currentNode) {
        return [];
      }
      let arr = [];
      arr.push(currentNode.value);
      let left = this.getArray(currentNode.left);
      let right = this.getArray(currentNode.right);
      
      return arr.concat(left).concat(right);
    },
    printCurrentLevel(level, currentNode=this.root) {
      let left,right;
      if (level === 0) {
        return currentNode.value
      }

      if (currentNode.left === null && currentNode.right === null) {
        // currentNode is a leaf
      }

      if (level > 1) {
        left = printCurrentLevel();
      }
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

x = treeClass([1,2,3,4,5,6,7]);
prettyPrint(x.root)
console.log(x.levelOrder());

// x = treeClass([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) //,6,7,8,9,10,11,12,13,14,15]) //,4,5]);
// prettyPrint(x.root);
// // // x.insert(0)
// // // x.insert(-1)
// x.deleteV2(7)
// x.deleteV2(5)
// x.deleteV2(6)
// x.deleteV2(3)
// x.deleteV2(2)
// x.insert(16)
// // x.deleteV2(1)

// // x.insert(16)

// // x.deleteV2(1)

// // x = treeClass([1,3,2]); //,3]);
// // x.insert(4)
// // x.insert(3)
// // x.deleteV2(1)
// // console.log(x.height(x.find(2)));
// // // x.deleteV2(18)
// prettyPrint(x.root);

// // // console.log(x.getArray());
// console.log(x.isBalanced());

// x = treeClass([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]);
// prettyPrint(x.root);
// x.deleteV2(16)
// x.deleteV2(18)
// prettyPrint(x.root);

// console.log(x.getArray());
// console.log(x.isBalanced());
// console.log(x.depth(x.find(1)));
// console.log(x.height(x.find(10)))


// y = treeClass([7,6,5,4,3,2,1,2.5]) //,4,2,1]);
// prettyPrint(y.root);
// console.log(y.root.right)
// console.log(y.deleteV2(4))
// prettyPrint(y.root)
// console.log(y.root)
// prettyPrint(y.root);
// console.log(y.getArray())

// x = treeClass([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 25, 6000]);
// prettyPrint(x.root);
// // console.log(x.delete(6000))
// // console.log(x.delete(25))
// // console.log(x.delete(5))
// // console.log(x.find(6345))
// // prettyPrint(x.root);
// console.log(x.getArray());


// OLD DELETE FUNCTION
// delete(value, currentNode=this.root) {
//   // THIS METHOD WONT WORK FOR ROOT NODES

//   // YOU CAN REPLACE ALL OF THIS WITH, but that is kind of cheating
//   // buildTree(this.getArray().remove(value));

//   // there are 3 cases for delete
//   // 1.) the node has no children, just make the parent node point to null instead of that node
//   // 2.) the node has 1 child, make parent of node, point to child of node
//   // 3.) the node has 2 children, find the next largest number after node.value, (go right onces, then go left until null, last value of this left tree is next greatest), replace current node, with that node.
//   // with an if else chain statement, order should be 3, 2, 1

//   // steps to delete an item
//   // 1.) find the parent of the node whose value is the desired value
//   //    - function findparent(value, currentNode)
//   //      - if (parent.left.value === value || parent.right.value === value) return parent
//   //      - else advance the node, if value < parent search parent.left, else search parent.right
//   // 2.) analyze the grandchildren, determine method
//   //      - node = the node with desired value
//   //      - if 2 children, see method#3
//   //      - if 1 left child, parent.left = parent.node.left
//   //      - if 1 right child, parent.right = parent.node
//   // 3.) execute removal
//   // try to perform these steps in order


//   function findParentNode(value, currentNode) {
//     // returns the parent of the node with the desired value
//     if (currentNode.left.value === value || currentNode.right.value === value) {
//       // one of the children has the correct value, return the currentNode
//       return currentNode;
//     } else if (!currentNode.left === null || currentNode.right === null) {
//       // this node has no children, so if it hasnt already been found, it doesnt exist
//       return 'value not found'
//     } else {
//       // traverse the tree according to the value
//       if (value < currentNode.value) {
//         // console.log('going left')
//         return findParentNode(value, currentNode.left)
//       } else if (value > currentNode.value) {
//         // console.log('going right')
//         return findParentNode(value, currentNode.right)
//       } else {
//         return 'something has gone terribly wrong'
//       }
//     }
//   }
//   // if (value === currentNode.value) {
//     // desiredNode is the currentNode
//   // }
//   let parent = findParentNode(value, currentNode);
//   let desiredNode = null;
//   if (value < parent.value) {
//     desiredNode = parent.left
//   } else {
//     desiredNode = parent.right
//   }

//   // determine the strat and execute changes
//   if (desiredNode.left && desiredNode.right) {
//     // method #3, desiredNode has 2 children
//     let nextGreatestNode = desiredNode.right;
//     while (nextGreatestNode.left) {
//       nextGreatestNode = nextGreatestNode.left
//     }
//     this.delete(nextGreatestNode.value);
//     desiredNode.value = nextGreatestNode.value

//   } else if (desiredNode.left || desiredNode.right) {
//     // method #2, desiredNode has 1 child
//     childNode = desiredNode.left || desiredNode.right;
//     if (desiredNode.value < parent.value) {
//       parent.left = childNode;
//     } else {
//       parent.right = childNode;
//     }
//   } else {
//     // method #1, desiredNode has no children
//     if (value < parent.value) {
//       parent.left = null;
//     } else {
//       parent.right = null;
//     }
//   }
//   return
// },