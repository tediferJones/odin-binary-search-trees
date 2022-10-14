
function nodeClass(value, left=null, right=null) {
  return {
    value,
    left,
    right
  }
}

function treeClass(arr) {
  // this function needs to be above to return statement
  // this allows it to be used during instantiation, and then passed into the returning object as a method
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

    return root;
  }
  
  return {
    root: buildTree([...new Set(arr.sort(function(a,b){ return a-b }))]), // sorts the array in ascedning order and removes duplicate values;
    buildTree,
    insert(value, currentNode=this.root) {
      // insert adds a leaf to tree, dont change the current order of nodes, just add to end where it would fit
      if (value === currentNode.value) {
        return 'Value already exists'
      } else if (value < currentNode.value) {
        if (currentNode.left === null) {
          return currentNode.left = nodeClass(value);
        }
        return this.insert(value, currentNode.left);
      } else if (value > currentNode.value) {
        if (currentNode.right === null) {
          return currentNode.right = nodeClass(value);
        }
        return this.insert(value, currentNode.right);
      }
    },
    delete(value, currentNode=this.root) {
      if (currentNode === null) {
        return currentNode;
      }

      if (value < currentNode.value) {
        currentNode.left = this.delete(value, currentNode.left)
      } else if (value > currentNode.value) {
        currentNode.right = this.delete(value, currentNode.right)
      } else {
        // if you've made it this far, currentNode is what you want to delete
        if (currentNode.left && currentNode.right) {
          nextGreatestNode = currentNode.right;
          while (nextGreatestNode.left) {
            nextGreatestNode = nextGreatestNode.left;
          }
          this.delete(nextGreatestNode.value)
          currentNode.value = nextGreatestNode.value
        } else if (currentNode.left || currentNode.right) {
          let temp = currentNode.left || currentNode.right;
          currentNode = temp
        } else {
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
    levelOrder(aFunction) {
      // SOLUTION: https://www.youtube.com/watch?v=H0i3gk1h0lI&ab_channel=Codevolution
      let result = [];
      let arr = []; // this is a queue, not just an array
      arr.push(this.root);
      while (arr.length) {
        let next = arr.shift();
        if (aFunction) {
          result.push(aFunction(next.value));
        } else {
          result.push(next.value);
        }

        if (next.left) {
          arr.push(next.left);
        }
        if (next.right) {
          arr.push(next.right);
        }
      }
      return result
    },
    inorder(aFunction, currentNode=this.root) {
      // SOLUTION: https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/
      // add left, add root, add right
      let result = [];
      if (currentNode == null) {
        return [];
      }

      let left = this.inorder(aFunction, currentNode.left);
      if (aFunction) {
        result.push(aFunction(currentNode.value));
      } else {
        result.push(currentNode.value);
      }
      let right = this.inorder(aFunction, currentNode.right);

      return left.concat(result).concat(right);
    },
    preorder(aFunction, currentNode=this.root) {
      // add root, add left, add right
      let result = [];
      if (currentNode == null) {
        return [];
      }

      if (aFunction) {
        result.push(aFunction(currentNode.value));
      } else {
        result.push(currentNode.value)
      }
      let left = this.preorder(aFunction, currentNode.left);
      let right = this.preorder(aFunction, currentNode.right);

      return result.concat(left).concat(right);
    },
    postorder(aFunction, currentNode=this.root) {
      // add left, add right, add root
      let result = [];
      if (currentNode == null) {
        return [];
      }

      let left = this.postorder(aFunction, currentNode.left);
      let right = this.postorder(aFunction, currentNode.right);
      if (aFunction) {
        result.push(aFunction(currentNode.value))
      } else {
        result.push(currentNode.value)
      }

      return left.concat(right).concat(result)
    },
    height(node) {
      // height is the number of edges (not nodes) between this element and its furthest leaf node
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

      return status && left && right
    },
    rebalance() {
      this.root = buildTree(this.getArray())
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

function testFunc(value) {
  // make sure levelOrder, inorder, preorder and postorder can all take this function as an input
  return value * 2
}

function simpleDriverScript() {
  // generates an array whose length is less than 50 with random values less than 100
  function randArray() {
    let arr = []
    let desiredLength = Math.floor(Math.random() * 50)
    while (arr.length < desiredLength) {
      arr.push(Math.floor(Math.random() * 100))
    }
    return arr
  }
  function printAllOrders(myBst) {
    console.log('LEVEL ORDER: ');
    console.log(myBst.levelOrder());
    console.log('PRE ORDER: ');
    console.log(myBst.preorder());
    console.log('POST ORDER: ')
    console.log(myBst.postorder());
    console.log('IN ORDER: ')
    console.log(myBst.inorder());
  }
  let myBst = treeClass(randArray());
  prettyPrint(myBst.root);
  console.log('Original tree is balanced? ' + myBst.isBalanced())
  if (myBst.isBalanced()) {
    printAllOrders(myBst);
    myBst.insert(9000);
    myBst.insert(9001);
    myBst.insert(9002);
    myBst.insert(9003);
    myBst.insert(9004);
    prettyPrint(myBst.root);
    console.log('After insertions, tree is still balanced? ' + myBst.isBalanced());
    if (!myBst.isBalanced()) {
      myBst.rebalance()
      prettyPrint(myBst.root);
      console.log('Tree has been properly rebalanced? ' + myBst.isBalanced());
      if (myBst.isBalanced()) {
        printAllOrders(myBst);
        console.log('SUCCESS')
      }
    }
  }
}

// x = treeClass([25,15,50,10,22,35,70,4,12,18,24,31,44,66,90]); // [1,2,3,4,5,6,7]);
// prettyPrint(x.root)
simpleDriverScript();
// x.delete(4)
// x.delete(10)
// x.delete(12)
// x.delete(24)
// x.delete(22)
// prettyPrint(x.root)
// x.rebalance()
// prettyPrint(x.root)