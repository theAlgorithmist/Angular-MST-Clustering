/** Copyright 2018 Jim Armstrong (www.algorithmist.net)
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

// Specs for TSMT SimpleGraph Class
import { TSMT$SimpleGraph
       , TSMT_CLUSTER_TYPE
       , gatherChildren
       , TSMT$INode
       , TSMT$IEdge
       , TSMT$ClusterData
       , TSMT$GraphData
       } from "../src/app/libs/SimpleGraph";

import * as Chai from 'chai';
const expect = Chai.expect;

const logEdges: Function = (mst: Array<TSMT$IEdge>): void => {
  const E: number = mst.length;
  let i: number;
  let e: TSMT$IEdge;
  for (i = 0; i < E; ++i)
  {
    e = mst[i];
    console.log( e.v1.key, e.v2.key, e.w );
  }
};

const graph1: TSMT$GraphData = {
  useCoords: false,
  nodes: [
    {
      key: '0'
    },
    {
      key: '1'
    },
    {
      key: '2'
    },
    {
      key: '3'
    },
    {
      key: '4'
    },
    {
      key: '5'
    },
    {
      key: '6'
    },
    {
      key: '7'
    },
    {
      key: '8'
    }
  ],
  edges: [
    {
      from: '0',
      to: '7',
      w: 8
    },
    {
      from: '0',
      to: '1',
      w: 4
    },
    {
      from: '1',
      to: '2',
      w: 8
    },
    {
      from: '1',
      to: '7',
      w: 11
    },
    {
      from: '7',
      to: '8',
      w: 7
    },
    {
      from: '7',
      to: '6',
      w: 1
    },
    {
      from: '2',
      to: '3',
      w: 7
    },
    {
      from: '2',
      to: '8',
      w: 2
    },
    {
      from: '8',
      to: '6',
      w: 6
    },
    {
      from: '3',
      to: '5',
      w: 14
    },
    {
      from: '2',
      to: '5',
      w: 4
    },
    {
      from: '3',
      to: '4',
      w: 9
    },
    {
      from: '5',
      to: '4',
      w: 10
    },
    {
      from: '6',
      to: '5',
      w: 2
    }
  ]
};

const graph2: TSMT$GraphData = {
  useCoords: false,
  nodes: [
    {
      key: 'A'
    },
    {
      key: 'B'
    },
    {
      key: 'C'
    },
    {
      key: 'D'
    },
    {
      key: 'E'
    },
    {
      key: 'F'
    },
    {
      key: 'G'
    }
  ],
  edges: [
    {
      from: 'A',
      to: 'B',
      w: 5
    },
    {
      from: 'B',
      to: 'F',
      w: 6
    },
    {
      from: 'A',
      to: 'C',
      w: 1
    },
    {
      from: 'A',
      to: 'D',
      w: 4
    },
    {
      from: 'C',
      to: 'D',
      w: 3
    },
    {
      from: 'D',
      to: 'F',
      w: 8
    },
    {
      from: 'C',
      to: 'E',
      w: 2
    },
    {
      from: 'E',
      to: 'F',
      w: 7
    },
    {
      from: 'E',
      to: 'G',
      w: 9
    }
  ]
};

const cluster1: TSMT$ClusterData = {
  nodes: [
    {
      key: 'A',
      x: 1,
      y: 1
    },
    {
      key: 'B',
      x: 1,
      y: 2
    },
    {
      key: 'C',
      x: 3,
      y: 2
    },
    {
      key: 'D',
      x: 3,
      y: 3
    },
    {
      key: 'E',
      x: 6,
      y: 6
    },
    {
      key: 'F',
      x: 6,
      y: 7
    },
    {
      key: 'G',
      x: 7,
      y: 6
    },
    {
      key: 'H',
      x: 7,
      y: 7
    }
  ]
};

const graph3: TSMT$GraphData = {
  nodes: [
    {
      key: '1'
    },
    {
      key: '2'
    },
    {
      key: '3'
    },
    {
      key: '4'
    },
    {
      key: '5'
    },
    {
      key: '6'
    },
    {
      key: '7'
    },
    {
      key: '8'
    }
  ],
  edges: [
    {
      from: '1',
      to: '2',
      w: 16
    },
    {
      from: '2',
      to: '4',
      w: 4
    },
    {
      from: '2',
      to: '3',
      w: 6
    },
    {
      from: '1',
      to: '3',
      w: 8
    },
    {
      from: '3',
      to: '5',
      w: 5
    },
    {
      from: '1',
      to: '5',
      w: 10
    },
    {
      from: '1',
      to: '6',
      w: 21
    },
    {
      from: '5',
      to: '6',
      w: 14
    },
    {
      from: '5',
      to: '7',
      w: 11
    },
    {
      from: '5',
      to: '8',
      w: 18
    },
    {
      from: '3',
      to: '8',
      w: 23
    },
    {
      from: '6',
      to: '7',
      w: 7
    },
    {
      from: '7',
      to: '8',
      w: 9
    },
    {
      from: '4',
      to: '8',
      w: 24
    }
  ]
};

const cluster2: TSMT$ClusterData = {
  nodes: [
    {
      key: 'a',
      x: 5,
      y: 7
    },
    {
      key: 'b',
      x: 6,
      y: 7
    },
    {
      key: 'c',
      x: 5.5,
      y: 9
    },
    {
      key: 'd',
      x: 6.5,
      y: 8.5
    },
    {
      key: 'e',
      x: 4,
      y: 8
    },
    {
      key: 'f',
      x: 7,
      y: 7
    },
    {
      key: 'g',
      x: 5,
      y: 4.8
    },
    {
      key: 'h',
      x: 8,
      y: 5
    },
    {
      key: 'i',
      x: 9,
      y: 5
    },
    {
      key: 'j',
      x: 9.5,
      y: 7
    },
    {
      key: 'k',
      x: 10,
      y: 5.8
    },
    {
      key: 'l',
      x: 6.5,
      y: 2
    },
    {
      key: 'm',
      x: 8,
      y: 2
    },
    {
      key: 'n',
      x: 9,
      y: 2.2
    },
    {
      key: 'o',
      x: 8,
      y: 0
    }
  ]
};

// Test Suites
describe('TSMT Simple Graph', () => {
  const graph: TSMT$SimpleGraph = new TSMT$SimpleGraph();

  it('newly constructed Graph has no vertices or edges', function () {
    expect(graph.edgeCount).to.equal(0);
    expect(graph.vertexCount).to.equal(0);
  });

  it('edge list of empty graph is an empty array', function () {
    expect(graph.edgeList.length).to.equal(0);
  });

  it('MST of empty graph is an empty array', function () {
    expect(graph.mst().length).to.equal(0);
  });

  it('adds a single edge', function () {
    const n1: TSMT$INode = TSMT$SimpleGraph.createNode('A');
    const n2: TSMT$INode = TSMT$SimpleGraph.createNode('B');

    const e: TSMT$IEdge = {
      v1: n1,
      v2: n2,
      w: 1
    };

    graph.addEdge(e);

    expect(graph.vertexCount).to.equal(2);
    expect(graph.edgeCount).to.equal(1);
  });

  it('clear works', function () {
    const n1: TSMT$INode = TSMT$SimpleGraph.createNode('C');
    const n2: TSMT$INode = TSMT$SimpleGraph.createNode('D');

    const e: TSMT$IEdge = {
      v1: n1,
      v2: n2,
      w: 2
    };

    graph.addEdge(e);

    graph.clear();

    expect(graph.vertexCount).to.equal(0);
    expect(graph.edgeCount).to.equal(0);
    expect(graph.mst().length).to.equal(0);
  });

  it('adds multiple edges', function () {
    graph.clear();

    const zero: TSMT$INode = TSMT$SimpleGraph.createNode('0');
    const one: TSMT$INode = TSMT$SimpleGraph.createNode('1');

    const two: TSMT$INode = TSMT$SimpleGraph.createNode('2');
    const three: TSMT$INode = TSMT$SimpleGraph.createNode('3');

    const e1: TSMT$IEdge = {
      v1: zero,
      v2: two,
      w: 6
    };

    const e2: TSMT$IEdge = {
      v1: zero,
      v2: one,
      w: 10
    };

    const e3: TSMT$IEdge = {
      v1: two,
      v2: three,
      w: 4
    };

    const e4: TSMT$IEdge = {
      v1: one,
      v2: three,
      w: 15
    };

    const e5: TSMT$IEdge = {
      v1: zero,
      v2: three,
      w: 5
    };

    graph.addEdge(e1);
    graph.addEdge(e2);
    graph.addEdge(e3);
    graph.addEdge(e4);
    graph.addEdge(e5);

    expect(graph.vertexCount).to.equal(4);
    expect(graph.edgeCount).to.equal(5);
  });

  it('MST of a single edge is the single edge', function () {
    graph.clear();

    const n1: TSMT$INode = TSMT$SimpleGraph.createNode('C');
    const n2: TSMT$INode = TSMT$SimpleGraph.createNode('D');

    const e: TSMT$IEdge = {
      v1: n1,
      v2: n2,
      w: 2
    };

    graph.addEdge(e);

    expect(graph.vertexCount).to.equal(2);
    expect(graph.edgeCount).to.equal(1);

    const mst: Array<TSMT$IEdge> = graph.mst();

    expect(mst.length).to.equal(1);
    expect(mst[0].v1.key).to.equal('C');
    expect(mst[0].v2.key).to.equal('D');
  });

  it('MST test #1', function () {
    graph.clear();

    const zero: TSMT$INode = TSMT$SimpleGraph.createNode('0');
    const one: TSMT$INode = TSMT$SimpleGraph.createNode('1');

    const two: TSMT$INode = TSMT$SimpleGraph.createNode('2');
    const three: TSMT$INode = TSMT$SimpleGraph.createNode('3');

    const e1: TSMT$IEdge = {
      v1: zero,
      v2: two,
      w: 6
    };

    const e2: TSMT$IEdge = {
      v1: zero,
      v2: one,
      w: 10
    };

    const e3: TSMT$IEdge = {
      v1: two,
      v2: three,
      w: 4
    };

    const e4: TSMT$IEdge = {
      v1: one,
      v2: three,
      w: 15
    };

    const e5: TSMT$IEdge = {
      v1: zero,
      v2: three,
      w: 5
    };

    graph.addEdge(e1);
    graph.addEdge(e2);
    graph.addEdge(e3);
    graph.addEdge(e4);
    graph.addEdge(e5);

    expect(graph.vertexCount).to.equal(4);
    expect(graph.edgeCount).to.equal(5);

    const mst: Array<TSMT$IEdge> = graph.mst();

    expect(mst.length).to.equal(3);

    expect(mst[0].v1.key).to.equal('2');
    expect(mst[0].v2.key).to.equal('3');
    expect(mst[1].v1.key).to.equal('0');
    expect(mst[1].v2.key).to.equal('3');
    expect(mst[2].v1.key).to.equal('0');
    expect(mst[2].v2.key).to.equal('1');
    expect(TSMT$SimpleGraph.getCost(mst)).to.equal(19);
  });

  it('from Object test #1', function () {
    graph.clear();

    graph.fromObject(graph1);

    expect(graph.vertexCount).to.equal(9);

    expect(graph.edgeCount).to.equal(14);
  });

  it('MST from Object data test #1', function () {
    graph.clear();

    graph.fromObject(graph1);

    expect(graph.vertexCount).to.equal(9);
    expect(graph.edgeCount).to.equal(14);

    const mst: Array<TSMT$IEdge> = graph.mst();

    expect(mst.length).to.equal(8);

    let e: TSMT$IEdge = mst[0];
    expect(e.v1.key).to.equal('7');
    expect(e.v2.key).to.equal('6');

    e = mst[1];
    expect(e.v1.key).to.equal('2');
    expect(e.v2.key).to.equal('8');

    e = mst[2];
    expect(e.v1.key).to.equal('6');
    expect(e.v2.key).to.equal('5');

    e = mst[3];
    expect(e.v1.key).to.equal('0');
    expect(e.v2.key).to.equal('1');

    e = mst[4];
    expect(e.v1.key).to.equal('2');
    expect(e.v2.key).to.equal('5');

    e = mst[5];
    expect(e.v1.key).to.equal('2');
    expect(e.v2.key).to.equal('3');

    e = mst[6];
    expect(e.v1.key).to.equal('0');
    expect(e.v2.key).to.equal('7');

    e = mst[7];
    expect(e.v1.key).to.equal('3');
    expect(e.v2.key).to.equal('4');

    expect(TSMT$SimpleGraph.getCost(mst)).to.equal(37);
  });

  it('MST from Object data test #2', function () {
    graph.clear();

    graph.fromObject(graph2);

    expect(graph.vertexCount).to.equal(7);
    expect(graph.edgeCount).to.equal(9);

    const mst: Array<TSMT$IEdge> = graph.mst();

    expect(mst.length).to.equal(6);

    let e: TSMT$IEdge = mst[0];
    expect(e.v1.key).to.equal('A');
    expect(e.v2.key).to.equal('C');

    e = mst[1];
    expect(e.v1.key).to.equal('C');
    expect(e.v2.key).to.equal('E');

    e = mst[2];
    expect(e.v1.key).to.equal('C');
    expect(e.v2.key).to.equal('D');

    e = mst[3];
    expect(e.v1.key).to.equal('A');
    expect(e.v2.key).to.equal('B');

    e = mst[4];
    expect(e.v1.key).to.equal('B');
    expect(e.v2.key).to.equal('F');

    e = mst[5];
    expect(e.v1.key).to.equal('E');
    expect(e.v2.key).to.equal('G');

    expect(TSMT$SimpleGraph.getCost(mst)).to.equal(26);
  });

  it('MST Test #3', function () {
    graph.clear();

    graph.fromObject(graph3);

    expect(graph.vertexCount).to.equal(8);

    const mst: Array<TSMT$IEdge> = graph.mst();
    const E: number = mst.length;

    expect(E).to.equal(7);

    expect(mst[0].v1.key).to.equal('2');
    expect(mst[0].v2.key).to.equal('4');
    expect(mst[1].v1.key).to.equal('3');
    expect(mst[1].v2.key).to.equal('5');
    expect(mst[2].v1.key).to.equal('2');
    expect(mst[2].v2.key).to.equal('3');
    expect(mst[3].v1.key).to.equal('6');
    expect(mst[3].v2.key).to.equal('7');
    expect(mst[4].v1.key).to.equal('1');
    expect(mst[4].v2.key).to.equal('3');
    expect(mst[5].v1.key).to.equal('7');
    expect(mst[5].v2.key).to.equal('8');
    expect(mst[6].v1.key).to.equal('5');
    expect(mst[6].v2.key).to.equal('7');

    expect(TSMT$SimpleGraph.getCost(mst)).to.equal(50);
  });

  it('toTree test', function () {
    graph.clear();

    graph.fromObject(graph2);

    const mst: Array<TSMT$IEdge> = graph.mst();

    const root: TSMT$INode = TSMT$SimpleGraph.toTree(mst);
    expect(root.key).to.equal('A');

    let children: Array<TSMT$INode> = gatherChildren(root);
    expect(children.length).to.equal(2);

    let node: TSMT$INode = children[0];
    expect(node.key).to.equal('C');

    node = children[1];
    expect(node.key).to.equal('B');

    // children of C are D and E
    node     = children[0];
    children = gatherChildren(node);
    expect(children.length).to.equal(2);
    expect(children[0].key).to.equal('E');
    expect(children[1].key).to.equal('D');

    // E has one child - G
    node     = children[0];
    children = gatherChildren(node);
    expect(children.length).to.equal(1);
    expect(children[0].key).to.equal('G');

    // back to A - pick up child of B
    children = gatherChildren(root);
    node     = children[1];

    expect(node.key).to.equal('B');
    children = gatherChildren(node);
    expect(children.length).to.equal(1);
    expect(children[0].key).to.equal('F');
  });

  it('Cluster edge-case test #1', function () {
    graph.clear();

    const clusters: Array<TSMT$INode> = graph.cluster(cluster1, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 0});

    expect(clusters.length).to.equal(0);
  });

  it('Cluster edge-case test #2', function () {
    graph.clear();

    const clusters: Array<TSMT$INode> = graph.cluster(cluster1, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 1});

    expect(clusters.length).to.equal(1);

    const cluster: Array<TSMT$INode> = graph.preorder(clusters[0]);

    expect(cluster.length).to.equal(8);

    expect(cluster[0].key).to.equal('A');
    expect(cluster[1].key).to.equal('B');
    expect(cluster[2].key).to.equal('C');
    expect(cluster[3].key).to.equal('D');
    expect(cluster[4].key).to.equal('E');
    expect(cluster[5].key).to.equal('G');
    expect(cluster[6].key).to.equal('H');
    expect(cluster[7].key).to.equal('F');
  });

  it('Cluster edge-case test #3', function () {
    graph.clear();

    const clusters: Array<TSMT$INode> = graph.cluster(cluster1, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 8});

    expect(clusters.length).to.equal(8);

    expect(clusters[0].key).to.equal('A');
    expect(clusters[1].key).to.equal('B');
    expect(clusters[2].key).to.equal('C');
    expect(clusters[3].key).to.equal('D');
    expect(clusters[4].key).to.equal('E');
    expect(clusters[5].key).to.equal('F');
    expect(clusters[6].key).to.equal('G');
    expect(clusters[7].key).to.equal('H');

    expect(clusters[0].children).to.be.null;
    expect(clusters[1].children).to.be.null;
    expect(clusters[2].children).to.be.null;
    expect(clusters[3].children).to.be.null;
    expect(clusters[4].children).to.be.null;
    expect(clusters[5].children).to.be.null;
    expect(clusters[6].children).to.be.null;
    expect(clusters[7].children).to.be.null;
  });

  it('Cluster test #1', function () {
    graph.clear();

    // test a default of two clusters
    const clusters: Array<TSMT$INode> = graph.cluster(cluster1);

    expect(clusters.length).to.equal(2);

    let root: TSMT$INode = clusters[0];
    expect(root.key).to.equal('A');

    root = clusters[1];
    expect(root.key).to.equal('E');

    // test the two tree structures
    root = clusters[0];
    let children: Array<TSMT$INode> = gatherChildren(root);

    expect(children.length).to.equal(1);

    let node: TSMT$INode = children[0];
    expect(node.key).to.equal('B');

    children = gatherChildren(node);
    expect(children.length).to.equal(1);

    node = children[0];
    expect(node.key).to.equal('C');

    children = gatherChildren(node);
    expect(children.length).to.equal(1);

    node = children[0];
    expect(node.key).to.equal('D');

    children = gatherChildren(node);
    expect(children.length).to.equal(0);

    // -----
    root     = clusters[1];
    children = gatherChildren(root);
    expect(children.length).to.equal(1);

    node = children[0];
    expect(node.key).to.equal('G');

    children = gatherChildren(node);
    expect(children.length).to.equal(1);
    node = children[0];

    expect(node.key).to.equal('H');
    children = gatherChildren(node);

    expect(children.length).to.equal(1);
    node = children[0];
    expect(node.key).to.equal('F');
  });

  it('Cluster test #2', function () {
    graph.clear();

    // test a default of two clusters
    const clusters: Array<TSMT$INode> = graph.cluster(cluster1);

    expect(clusters.length).to.equal(2);

    // test preorder collection from each cluster
    let root: TSMT$INode = clusters[0];
    expect(root.key).to.equal('A');

    let cluster: Array<TSMT$INode> = graph.preorder(root);

    expect(cluster.length).to.equal(4);
    expect(cluster[0].key).to.equal('A');
    expect(cluster[1].key).to.equal('B');
    expect(cluster[2].key).to.equal('C');
    expect(cluster[3].key).to.equal('D');

    root = clusters[1];
    expect(root.key).to.equal('E');

    cluster = graph.preorder(root);
    expect(cluster.length).to.equal(4);
    expect(cluster[0].key).to.equal('E');
    expect(cluster[1].key).to.equal('G');
    expect(cluster[2].key).to.equal('H');
    expect(cluster[3].key).to.equal('F');
  });

  it('Cluster test #3', function () {
    graph.clear();

    // 3-cluster test
    const clusters: Array<TSMT$INode> = graph.cluster(cluster1, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 3});

    let root: TSMT$INode = clusters[0];
    expect(root.key).to.equal('A');

    // check tree structure for each cluster
    let children: Array<TSMT$INode> = gatherChildren(root);
    expect(children.length).to.equal(1);

    let node: TSMT$INode = children[0];
    expect(node.key).to.equal('B');

    children = gatherChildren(node);
    expect(children.length).to.equal(0);

    root = clusters[1];
    expect(root.key).to.equal('E');

    children = gatherChildren(root);
    expect(children.length).to.equal(1);

    node = children[0];
    expect(node.key).to.equal('G');

    children = gatherChildren(node);
    expect(children.length).to.equal(1);
    node = children[0];

    expect(node.key).to.equal('H');
    children = gatherChildren(node);

    expect(children.length).to.equal(1);
    node = children[0];
    expect(node.key).to.equal('F');

    root = clusters[2];
    expect(root.key).to.equal('C');

    children = gatherChildren(root);
    expect(children.length).to.equal(1);

    node = children[0];
    expect(node.key).to.equal('D');

    children = gatherChildren(node);
    expect(children.length).to.equal(0);
  });

  it('Cluster test #4', function () {
    graph.clear();

    // 3-cluster test
    const clusters: Array<TSMT$INode> = graph.cluster(cluster1, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 3});

    // test preorder collection from each cluster
    let root: TSMT$INode = clusters[0];
    expect(root.key).to.equal('A');

    let cluster: Array<TSMT$INode> = graph.preorder(root);
    expect(cluster.length).to.equal(2);
    expect(cluster[0].key).to.equal('A');
    expect(cluster[1].key).to.equal('B');

    root = clusters[1];
    expect(root.key).to.equal('E');

    cluster = graph.preorder(root);
    expect(cluster.length).to.equal(4);
    expect(cluster[0].key).to.equal('E');
    expect(cluster[1].key).to.equal('G');
    expect(cluster[2].key).to.equal('H');
    expect(cluster[3].key).to.equal('F');

    root = clusters[2];
    expect(root.key).to.equal('C');
    cluster = graph.preorder(root);

    expect(cluster.length).to.equal(2);
    expect(cluster[0].key).to.equal('C');
    expect(cluster[1].key).to.equal('D');
  });

  it('Cluster test #5', function () {
    graph.clear();

    // one-cluster test also checks toTree() method
    const clusters: Array<TSMT$INode> = graph.cluster(cluster2, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 1});

    expect(clusters.length).to.equal(1);

    let root: TSMT$INode = clusters[0];
    expect(root.key).to.equal('a');

    let children: Array<TSMT$INode> = gatherChildren(root);

    expect(children.length).to.equal(3);

    let b: TSMT$INode = children[0];
    let e: TSMT$INode = children[1];
    let g: TSMT$INode = children[2];

    expect(b.key).to.equal('b');
    expect(e.key).to.equal('e');
    expect(g.key).to.equal('g');

    children = gatherChildren(b);
    expect(children.length).to.equal(1);

    let f: TSMT$INode = children[0];
    expect(f.key).to.equal('f');

    children = gatherChildren(f);
    expect(children.length).to.equal(2);

    let d: TSMT$INode = children[0];
    let h: TSMT$INode = children[1];

    expect(d.key).to.equal('d');
    expect(h.key).to.equal('h');

    children = gatherChildren(d);
    expect(children.length).to.equal(1);

    let c: TSMT$INode = children[0];
    expect(c.key).to.equal('c');

    children = gatherChildren(h);
    expect(children.length).to.equal(1);

    let i: TSMT$INode = children[0];
    expect(i.key).to.equal('i');

    children = gatherChildren(i);
    expect(children.length).to.equal(2);

    let k: TSMT$INode = children[0];
    let n: TSMT$INode = children[1];

    expect(k.key).to.equal('k');
    expect(n.key).to.equal('n');

    children = gatherChildren(k);
    expect(children.length).to.equal(1);

    let j: TSMT$INode = children[0];
    expect(j.key).to.equal('j');

    children = gatherChildren(n);
    expect(children.length).to.equal(1);

    let m: TSMT$INode = children[0];
    expect(m.key).to.equal('m');

    children = gatherChildren(m);
    expect(children.length).to.equal(2);

    let l: TSMT$INode = children[0];
    expect(l.key).to.equal('l');

    let o: TSMT$INode = children[1];
    expect(o.key).to.equal('o');
  });

  it('Cluster test #6', function () {
    graph.clear();

    // one-cluster test also checks toTree() method
    const clusters: Array<TSMT$INode> = graph.cluster(cluster2, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 1});

    expect(clusters.length).to.equal(1);

    let root: TSMT$INode = clusters[0];
    expect(root.key).to.equal('a');

    let cluster: Array<TSMT$INode> = graph.preorder(root);

    expect(cluster.length).to.equal(15);

    expect(cluster[0].key).to.equal('a');
    expect(cluster[1].key).to.equal('b');
    expect(cluster[2].key).to.equal('f');
    expect(cluster[3].key).to.equal('d');
    expect(cluster[4].key).to.equal('c');
    expect(cluster[5].key).to.equal('h');
    expect(cluster[6].key).to.equal('i');
    expect(cluster[7].key).to.equal('k');
    expect(cluster[8].key).to.equal('j');
    expect(cluster[9].key).to.equal('n');
    expect(cluster[10].key).to.equal('m');
    expect(cluster[11].key).to.equal('l');
    expect(cluster[12].key).to.equal('o');
    expect(cluster[13].key).to.equal('e');
    expect(cluster[14].key).to.equal('g');
  });

  it('Cluster test #7', function () {
    graph.clear();

    const clusters: Array<TSMT$INode> = graph.cluster(cluster2, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 2});

    expect(clusters.length).to.equal(2);

    let root: TSMT$INode = clusters[0];
    expect(root.key).to.equal('a');

    let cluster: Array<TSMT$INode> = graph.preorder(root);

    expect(cluster.length).to.equal(11);

    expect(cluster[0].key).to.equal('a');
    expect(cluster[1].key).to.equal('b');
    expect(cluster[2].key).to.equal('f');
    expect(cluster[3].key).to.equal('d');
    expect(cluster[4].key).to.equal('c');
    expect(cluster[5].key).to.equal('h');
    expect(cluster[6].key).to.equal('i');
    expect(cluster[7].key).to.equal('k');
    expect(cluster[8].key).to.equal('j');
    expect(cluster[9].key).to.equal('e');
    expect(cluster[10].key).to.equal('g');

    root    = clusters[1];
    cluster = graph.preorder(root);

    expect(root.key).to.equal('n');

    expect(cluster[0].key).to.equal('n');
    expect(cluster[1].key).to.equal('m');
    expect(cluster[2].key).to.equal('l');
    expect(cluster[3].key).to.equal('o');
  });

  it('Cluster test #8', function () {
    graph.clear();

    const clusters: Array<TSMT$INode> = graph.cluster(cluster2, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 3});

    expect(clusters.length).to.equal(3);

    let root: TSMT$INode = clusters[0];
    expect(root.key).to.equal('a');

    let cluster: Array<TSMT$INode> = graph.preorder(root);

    expect(cluster.length).to.equal(7);

    expect(cluster[0].key).to.equal('a');
    expect(cluster[1].key).to.equal('b');
    expect(cluster[2].key).to.equal('f');
    expect(cluster[3].key).to.equal('d');
    expect(cluster[4].key).to.equal('c');
    expect(cluster[5].key).to.equal('e');
    expect(cluster[6].key).to.equal('g');

    root    = clusters[1];
    cluster = graph.preorder(root);

    expect(root.key).to.equal('n');

    expect(cluster[0].key).to.equal('n');
    expect(cluster[1].key).to.equal('m');
    expect(cluster[2].key).to.equal('l');
    expect(cluster[3].key).to.equal('o');

    root = clusters[2];
    cluster = graph.preorder(root);

    expect(root.key).to.equal('h');

    expect(cluster[0].key).to.equal('h');
    expect(cluster[1].key).to.equal('i');
    expect(cluster[2].key).to.equal('k');
    expect(cluster[3].key).to.equal('j');
  });
});
