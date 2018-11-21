# Euclidean Minimum Spanning Tree and Clustering (Angular 6/SVG demo)

This project is a heavily sanitized version of a proof of concept performed for a prospective client.  In short, the problem (as given to me) deals with sensor placement on walls and ceilings.  A typical number is 15-20 and the high-end estimate is 30 sensors.  The minimum-wiring cost problem needed to be solved along with at least k-clustering.  The client also wanted to collaborate on an auto-cluster algorithm that is not included in this demo.

With such a small number of nodes, the problem can be adequately solved with a simple implementation of the Euclidean minimum spanning tree.  This is not the ideal solution for a large number of nodes, and more information [can be obtained here](https://en.wikipedia.org/wiki/Euclidean_minimum_spanning_tree).  The current approach, however, is computationally reasonable and much easier to follow for the relatively small expected node count. 

A new class, _TSMT$SimpleGraph_ was added to the Typescript Math Toolkit.  This class is optimized for reading graph data (one-time) from an _Object_, computing the minimum spanning tree as a separate operation, or performing k-clustering.  In the latter case, the general MST method is re-used as a sub-step in the Euclidean MST algorithm (sub-optimal, but simple and easy for other developers to follow).

Kruskal's algorithm is used for the MST as I recently finished an implementation of [Disjoint Set](https://github.com/theAlgorithmist/TSDisjointSet).  The k-clustering problem is solved by deletion of the k-1 most expensive edges of the MST. 

When the MST is first computed, a tree is constructed from the edge list with the first node of the first edge as a root.  Tree pruning is used to separate the clusters.  Both _find_ and _preorder_ methods are provided.  This allows the user to determine whether or not a node with a prescribed key is located in a given cluster, or return all nodes in a cluster in an array (using preorder traversal).

The layout (organization of nodes in a supporting structure such as wall or ceiling), MST, and cluster identification is rendered using SVG (SVG.js in particular).  An Angular structural directive is used to augment a container (DIV) with the necessary SVG canvas and provide drawing methods.

 
Author:  Jim Armstrong - [The Algorithmist](http://www.algorithmist.net)

@algorithmist

theAlgorithmist [at] gmail [dot] com

Angular: 6.1.0

SVG.js 2.7.0

Typescript: 2.9.2

Angular CLI: 6.2.3

Version: 1.0

## TSMT$SimpleGraph

This class is optimized for a read-once/compute-once environment in which data is provided to the class and a single set of computations is performed.  For performance reasons, there is less focus on immutability than might be present in a more robust environment.  Nodes are not cloned for example; direct references are provided.  So, even in instances where an array copy is performed in an accessor, that copy is shallow and it is possible to mutate one of the returned nodes.

The _TSMT$SimpleGraph_ class exposes the following API

```
public static createNode(key: string, x: number = 0, y: number = 0): TSMT$INode
public static toTree(mst: Array<TSMT$IEdge>): TSMT$INode | null
public static getCost(mst: Array<TSMT$IEdge>): number
public get edgeCount(): number
public get edgeList(): Array<TSMT$IEdge>
public get vertexCount(): number
public getMST(): Array<TSMT$IEdge>
public get deletedEdges(): Array<TSMT$IEdge>
public preorder(node: TSMT$INode): Array<TSMT$INode>
public clear(): void
public fromObject(data: TSMT$GraphData): void
public addEdge(edge: TSMT$IEdge): void
public mst(): Array<TSMT$IEdge>
public cluster(data: TSMT$ClusterData, type: string=TSMT_CLUSTER_TYPE.BY_NUMBER, params: Object=TSMT_CLUSTER_DEFAULT_PARAMS, first: boolean = true): Array<TSMT$INode>
 
```

## SVGContainerDirective

This attribute directive augments a container (DIV) with a SVG surface and provides inputs for specifying the top/right extent of the layout in user coordinates.  Since the application deals with physical dimensions, the left/bottom extent of a wall/ceiling corresponds to the origin.  Axis orientation is y-up, so a zero y-coordinate is at the bottom of the display area.  Mapping from physical to canvas or surface coordinates is handled by the directive.

This directive also exposes a _draw_ method to draw or render the current layout.  The nodes should be appropriately colored in advance, based on cluster association.  This is handled in the main app component.


## Running the demo

The application reads a layout (organization of sensor locations in a wall, for example) from a JSON file.  The node data is extracted and used to create graphical nodes for rendering.  The data is also sent to the _TSMT$SimpleGraph cluster_ method with an initial cluster of 1.  This displays the full MST of the vertex set.

The number of clusters is selectable from 1-3.  Each cluster is visually identified by node color (and no display of the edge deleted from the MST).  The node _id's_ or _key_ values are displayed for each cluster via the _preorder_ method and a helper function to create the databound string.

You should see a display similar to the following:

![cluster example](http://algorithmist.net/image/cluster.png "Three-cluster example")


## Low-level Testing

A set of specs (Mocha/Chai) are provided that exercise the _TSMT$SimpleGraph_ class and provide further examples of its usage.  To run the tests,

- cd test (from the project root folder)
- gulp compile
- gulp test

Specs reside in the _graph.specs.ts_ file.

I hope you find something of interest in the code.

Enjoy!!

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
