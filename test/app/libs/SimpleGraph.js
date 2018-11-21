"use strict";
/**
 * Copyright 2018 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const SortOn_1 = require("./SortOn");
/**
 * Typescript Math Toolkit: Simple Graph.  This is a very lightweight graph class that contains in-lined methods for
 * union-find that are in the TSMT$DisjointSet data structure for purposes of computing the MST.  The ability to read
 * graph data from a file is provided along with clustering.  This structure is useful when the graph should be
 * constructed directly from {Object} data (i.e. a service return) and then either the MST is directly computed or
 * cluster analysis is immediately performed.  No further operations are supported on the graph.
 *
 * Note that there are more efficient methods for computing the Euclidean MST, but the number of nodes is expected
 * to be sufficiently small that actual run-time will be more than adequate for a higher complexity, but simpler to
 * implement (and general) MST.
 *
 * This is a convenience class that provides computations in a package that is optimized for performance.  As such,
 * mutability of internal structures is possible.  Expected use-case for this class is an assign-once, compute-once
 * mode, so mutability should not be much of an issue.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
function gatherChildren(root) {
    if (root == null) {
        return [];
    }
    let n = root.children;
    if (n === undefined || n == null) {
        return [];
    }
    const children = [n];
    while (n.next != null) {
        children.push(n.next);
        n = n.next;
    }
    return children;
}
exports.gatherChildren = gatherChildren;
;
// types of clustering
var TSMT_CLUSTER_TYPE;
(function (TSMT_CLUSTER_TYPE) {
    TSMT_CLUSTER_TYPE["AUTO"] = "auto";
    TSMT_CLUSTER_TYPE["BY_NUMBER"] = "by_number";
})(TSMT_CLUSTER_TYPE = exports.TSMT_CLUSTER_TYPE || (exports.TSMT_CLUSTER_TYPE = {}));
exports.TSMT_CLUSTER_DEFAULT_PARAMS = {
    clusters: 2
};
;
class TSMT$SimpleGraph {
    constructor() {
        this._edges = new Array();
        this._vertices = new Array();
        this._sets = new Array();
        this._mst = new Array();
        this._hash = {};
    }
    static createNode(key, x = 0, y = 0) {
        const xCoord = x !== undefined && !isNaN(x) ? x : 0;
        const yCoord = y !== undefined && !isNaN(y) ? y : 0;
        return {
            key: key,
            x: xCoord,
            y: yCoord,
            rank: 0,
            parent: null
        };
    }
    static toTree(mst) {
        if (mst === undefined || mst == null || mst.length == 0) {
            return null;
        }
        const E = mst.length;
        let e;
        let i;
        // remove information from disjoint set processing
        for (i = 0; i < E; ++i) {
            e = mst[i];
            e.v1.parent = null;
            e.v2.parent = null;
        }
        let list = mst.slice(); // shallow copy is okay
        // first one is easy :)
        e = list[0];
        let source = e.v1;
        let dest = e.v2;
        let root = source;
        let node;
        root.parent = null;
        root.children = dest;
        root.tail = dest;
        dest.parent = root;
        dest.next = null;
        list.shift();
        i = 0;
        while (list.length > 0) {
            e = list[i];
            source = e.v1;
            dest = e.v2;
            node = TSMT$SimpleGraph.getNode(source.key, root);
            if (node != null) {
                TSMT$SimpleGraph.__add(source, dest);
                // this edge is processed
                list.splice(i, 1);
                i = 0;
            }
            else {
                node = TSMT$SimpleGraph.getNode(dest.key, root);
                if (node != null) {
                    TSMT$SimpleGraph.__reverse(source, dest);
                    list.splice(i, 1);
                    i = 0;
                }
                else {
                    i = (i + 1) % list.length;
                }
            }
        }
        return root;
    }
    static __add(source, dest) {
        if (source.children !== undefined) {
            // add the next node
            source.tail.next = dest;
            source.tail = dest;
            dest.parent = source;
            dest.next = null; // this is currently the tail node
        }
        else {
            // create first time
            source.children = dest;
            source.children.next = null;
            source.tail = dest;
            dest.parent = source;
        }
    }
    static __reverse(source, dest) {
        let tmp = source;
        source = dest;
        dest = tmp;
        source.children = dest;
        source.children.next = null;
        source.tail = dest;
        dest.parent = source;
    }
    preorder(node) {
        this._path = new Array();
        this.__preorderTraversal(node);
        return this._path.slice();
    }
    __preorderTraversal(node) {
        if (node == null) {
            return;
        }
        this._path.push(node);
        let list = node.children;
        while (list && list.next != null) {
            this.__preorderTraversal(list);
            list = list.next;
        }
        if (node.tail) {
            this.__preorderTraversal(node.tail);
        }
    }
    static getCost(mst) {
        const E = mst.length;
        let i;
        let e;
        let cost = 0;
        for (i = 0; i < E; ++i) {
            e = mst[i];
            cost += e.w;
        }
        return cost;
    }
    get edgeCount() {
        return this._edges.length;
    }
    get edgeList() {
        return this._edges;
    }
    get vertexCount() {
        return this._vertices.length;
    }
    clear() {
        this._edges.length = 0;
        this._vertices.length = 0;
        this._sets.length = 0;
        this._mst.length = 0;
        this._hash = {};
    }
    fromObject(data) {
        if (data === undefined || data == null) {
            return;
        }
        if (!data.hasOwnProperty('edges') || !data.hasOwnProperty('nodes')) {
            return;
        }
        const useCoords = data['useCoords'] === true;
        const nodeList = data['nodes'];
        let i;
        let v;
        let node;
        let n = nodeList.length;
        for (i = 0; i < n; ++i) {
            node = nodeList[i];
            // guard against repeated nodes - could be errors/typos in the data
            if (!this._hash.hasOwnProperty(node.key)) {
                // create a new vertex
                v = TSMT$SimpleGraph.createNode(node.key, node.x, node.y);
                this._hash[node.key] = v;
                this._vertices.push(v); // this is likely to be removed at some point in the future
            }
        }
        const edgeList = data['edges'];
        let e;
        // process edge list; should be complete - you break it, you buy it
        n = edgeList.length;
        let v1;
        let v2;
        for (i = 0; i < n; ++i) {
            e = edgeList[i];
            // from-to vertices for this edge
            v1 = this._hash[e.from];
            v2 = this._hash[e.to];
            this._edges.push({
                v1: v1,
                v2: v2,
                w: useCoords ? this.__getWeight(v1, v2, e.w) : e.w
            });
        }
    }
    addEdge(edge) {
        if (edge) {
            if (edge.v1 && edge.v2 && edge.w && edge.w >= 0) {
                this._edges.push(edge);
                this.__updateVertexCount(edge.v1, edge.v2);
            }
        }
    }
    mst() {
        // just Kruskal's algorithm ... nothing new under the sun :)
        const edges = new Array();
        // trivial edge cases
        const E = this._edges.length;
        if (E == 0) {
            return [];
        }
        if (E == 1) {
            return this._edges;
        }
        // edge sort on weight property
        SortOn_1.sortOn(this._edges, ['w']);
        // initial list of disjoint sets is all singletons
        const V = this._vertices.length;
        let i;
        for (i = 0; i < V; ++i) {
            this.__makeSet(this._vertices[i]);
        }
        // here we go ...
        let next;
        let n1;
        let n2;
        i = 0;
        while (edges.length < V - 1) {
            next = this._edges[i];
            n1 = this.__find(next.v1);
            n2 = this.__find(next.v2);
            if (n1.key != n2.key) {
                edges.push(next);
                this.__union(n1, n2);
            }
            i++;
        }
        return edges;
    }
    cluster(data, type = TSMT_CLUSTER_TYPE.BY_NUMBER, params = exports.TSMT_CLUSTER_DEFAULT_PARAMS, first = true) {
        const nodeList = data['nodes'];
        let i;
        let v;
        let node;
        let n = nodeList.length;
        for (i = 0; i < n; ++i) {
            node = nodeList[i];
            if (!this._hash.hasOwnProperty(node.key)) {
                // create a new vertex
                v = TSMT$SimpleGraph.createNode(node.key, node.x, node.y);
                this._hash[node.key] = v;
                this._vertices.push(v); // this is likely to be removed at some point in the future
            }
        }
        // the number of possible edges is C(n,2) = n*(n-1)/2, which is the count of the elements in the the lower
        // triangle of the connectivity matrix between all nodes.  Note that there is a better way to do this for
        // larger problems (but more difficult to follow) and it may be included in a future update.  This is a
        // reasonable starting point for most interactive applications, since n will be relatively small.  It also
        // allows this class to serve as a general Graph class with MST as a separate concern.
        //
        // For more on the Euclidean minimum spanning tree: https://en.wikipedia.org/wiki/Euclidean_minimum_spanning_tree
        let j;
        for (i = 0; i < n; ++i) {
            for (j = i + 1; j < n; ++j) {
                this._edges.push({
                    v1: this._vertices[i],
                    v2: this._vertices[j],
                    w: this.__getWeight(this._vertices[i], this._vertices[j], 1)
                });
            }
        }
        let result;
        if (first) {
            this._mst = this.mst();
        }
        switch (type) {
            case TSMT_CLUSTER_TYPE.BY_NUMBER:
                // create the specified number of clusters
                result = this.__clusterByNumber(+params['clusters']);
                break;
            case TSMT_CLUSTER_TYPE.AUTO:
                result = this.__autoCluster();
                break;
            default:
                // other options to be supported at some future time
                result = [TSMT$SimpleGraph.toTree(this._mst)];
                break;
        }
        return result;
    }
    __clusterByNumber(clusters) {
        if (clusters === undefined || clusters == null || isNaN(clusters)) {
            return [];
        }
        clusters = Math.abs(Math.round(clusters));
        // edge cases
        if (clusters == 0) {
            return [];
        }
        if (clusters == 1) {
            return [TSMT$SimpleGraph.toTree(this._mst)];
        }
        const V = this._vertices.length;
        if (clusters >= V) {
            const result = new Array();
            let i;
            let n;
            for (i = 0; i < V; ++i) {
                n = this._vertices[i];
                n.parent = null;
                n.children = null;
                n.tail = null;
                result.push(this._vertices[i]);
            }
            return result;
        }
        // can't help it ... I'm a RUSH fan :)
        const theTrees = [TSMT$SimpleGraph.toTree(this._mst)];
        let index = this._mst.length - 1;
        // highest cost edge is always at the end
        let e = this._mst[index];
        // split
        let source = e.v1;
        let dest = e.v2;
        // prune dest node from source child list if there is more than one child
        this.__prune(source, dest);
        theTrees.push(dest); // new head of second 'half'
        if (clusters == 2) {
            return theTrees;
        }
        // well, now we have to do some more work ...
        let clusterCount = 2;
        while (clusterCount < clusters) {
            index--;
            e = this._mst[index];
            source = e.v1;
            dest = e.v2;
            this.__prune(source, dest);
            theTrees.push(dest);
            clusterCount++;
        }
        return theTrees;
    }
    __prune(source, dest) {
        // TODO the entire set of computations could be completely in-lined into the above code (left as an exercise)
        const c = gatherChildren(source);
        const n = c.length;
        if (n == 1) {
            // the easy case ...
            source.children = null; // make this a leaf
            source.tail = null;
            dest.parent = null; // make this a root
            return;
        }
        // TODO this can also be compressed - cases split out to make it easier to follow
        // dest at the beginning?
        if (c[0].key === dest.key) {
            source.children = source.children.next;
            dest.next = null;
        }
        else if (c[n - 1].key === dest.key) {
            // dest at the end
            source.tail = c[n - 2];
            c[n - 2].next = null;
        }
        else {
            // okay, scan for it ...
            let i;
            let node;
            for (i = 1; i < n - 1; ++i) {
                node = c[i];
                if (node.key === dest.key) {
                    c[i - 1].next = node.next;
                    dest.next = null;
                }
            }
        }
        dest.parent = null;
    }
    static getNode(id, root) {
        // nothing new ... move along ... move along
        if (root.key == id) {
            return root;
        }
        let list = root.children;
        let node;
        while (list.next != null) {
            node = list;
            if (node.key == id) {
                return node;
            }
            if (node.children != null) {
                node = TSMT$SimpleGraph.getNode(id, node);
                if (node != null) {
                    return node;
                }
            }
            list = list.next;
        }
        if (root.tail.key == id) {
            return root.tail;
        }
        if (root.tail.children != null) {
            node = TSMT$SimpleGraph.getNode(id, root.tail);
            if (node != null) {
                return node;
            }
        }
        return null;
    }
    __autoCluster() {
        // open for future implementation
        console.log("TODO: Auto-cluster to be implemented");
        return [];
    }
    __getWeight(v1, v2, w = 1) {
        const x1 = v1.x !== undefined && !isNaN(v1.x) ? v1.x : 0;
        const y1 = v1.y !== undefined && !isNaN(v1.y) ? v1.y : 0;
        const x2 = v2.x !== undefined && !isNaN(v2.x) ? v2.x : 0;
        const y2 = v2.y !== undefined && !isNaN(v2.y) ? v2.y : 0;
        const dx = x2 - x1;
        const dy = y2 - y1;
        w = w == undefined || isNaN(w) ? 1 : w;
        return w * Math.sqrt(dx * dx + dy * dy);
    }
    __makeSet(node) {
        node.parent = node;
        node.rank = 0;
        this._sets.push(node);
    }
    __updateVertexCount(v1, v2) {
        if (this._hash[v1.key] === undefined) {
            this._hash[v1.key] = v1;
            this._vertices.push(v1);
        }
        if (this._hash[v2.key] === undefined) {
            this._hash[v2.key] = v2;
            this._vertices.push(v2);
        }
    }
    __findNode(node) {
        if (node === undefined || node == null) {
            return null;
        }
        const n = this.__find(node);
        // path compression may reduce the rank of the representative node by 1
        if (n.rank > 1) {
            n.rank = n.rank - 1;
        }
        return n;
    }
    __find(node) {
        if (node.parent.key != node.key) {
            node.parent = this.__find(node.parent);
        }
        return node.parent;
    }
    __union(x, y) {
        const rootX = this.__findNode(x);
        const rootY = this.__findNode(y);
        if (rootX == null || rootY == null) {
            return;
        }
        if (rootX.key != rootY.key) {
            this.__join(rootX, rootY);
        }
    }
    __join(x, y) {
        let index;
        // note that x and y are expected to be representative nodes and thus roots of a tree
        if (x.rank >= y.rank) {
            // y is rooted to x
            y.parent = x;
            index = this.__indexOf(y);
            if (index != -1) {
                this._sets.splice(index, 1);
            }
            x.rank = x.rank == 0 ? 1 : x.rank;
        }
        else {
            // x is rooted to y
            x.parent = y;
            index = this.__indexOf(x);
            if (index != -1) {
                this._sets.splice(index, 1);
            }
            y.rank = y.rank == 0 ? 1 : y.rank;
        }
    }
    __indexOf(node) {
        const n = this._sets.length;
        let index = -1;
        let i;
        let nd;
        for (i = 0; i < n; ++i) {
            nd = this._sets[i]; // representative node for a set
            if (node.key == nd.key) {
                index = i;
                break;
            }
        }
        return index;
    }
}
exports.TSMT$SimpleGraph = TSMT$SimpleGraph;
//# sourceMappingURL=SimpleGraph.js.map