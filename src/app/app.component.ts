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

/**
 * Main App Components for the MST Clustering Demo
 *
 * @author Jim Armstrong
 *
 * @version 1.0
 */
import { Component
       , OnInit
       , AfterViewInit
       , ViewChild
} from '@angular/core';

import { ModelService } from './services/model.service';

import { nodesToString } from './libs/nodesToString';

import {
  TSMT$INode
  , TSMT$IEdge
  , TSMT$SimpleGraph, TSMT_CLUSTER_TYPE
} from './libs/SimpleGraph';

// this is responsible for the graph rendering
import { SvgContainerDirective } from './directives/svg-container.directive';

// models
import { GraphNode   } from './models/models';
import { LayoutModel } from './models/models';

@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',

  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit
{
  // some drawing properties
  public static readonly DEFAULT_NODE_COLOR: string = '#333333';
  public static readonly DEFAULT_RADIUS: number     = 16;

  // currently only support coloring up to four clusters
  public static readonly CLUSTER_COLORS: Array<string> = ['#333333', '#8b0000', '#006400', '9b870c'];

  // reference to the SVG Container for rendering
  @ViewChild(SvgContainerDirective)
  protected _svgContainer: SvgContainerDirective;

  // tile of the layout and number of nodes
  public layoutTitle: string = '';
  public nodeCount: string   = '0';

  // list of nodes in each cluster
  public clusterList: Array<string>;

  protected _data: LayoutModel;         // copy of layout data

  protected _graph: TSMT$SimpleGraph;   // SimpleGraph handles primitive graph operations, MST, and clustering

  protected _mst: Array<TSMT$IEdge>;    // the MST does not vary as the number of clusters changes

  /**
   * Construct a new AppComponent
   *
   * @param {ModelService} _modelService Injected reference to the service that reads the model data
   *
   * @returns {nothing}
   */
  constructor(private _modelService: ModelService)
  {
    this._graph = new TSMT$SimpleGraph();

    this.clusterList = new Array<string>();
  }

  /**
   * Angular lifecycle on init
   *
   * @returns {nothing}
   */
  public ngOnInit(): void
  {
    // simulate loading a layout or model from a server
    this._modelService.getData('./assets/models/layout.json').subscribe( (data: LayoutModel) => this.__onModelLoaded(data) );
  }

  /**
   * Angular lifecycle after view init
   *
   * @returns {nothing}
   */
  public ngAfterViewInit(): void
  {
    // reserved for future use
  }

  /**
   * Execute whenever a number of clusters is selected
   *
   * @param {number} count Number of clusters (expected to be 1, 2, 3 for this demo)
   *
   * @returns {nothing}
   */
  public onClusterSelected(count: number): void
  {
    count = Math.round(Math.abs(count));

    // practical limit for current demo, but modify as you see fit
    if (count <= 3)
    {
      this.clusterList.length = 0;

      let root: TSMT$INode;
      let nodes: Array<TSMT$INode>;
      let i: number, color: string;

      // TODO Modify SimpleGraph to cache all previous E-MST computations in addition to MST on first call
      this._graph.clear();

      const clusters: Array<TSMT$INode> = this._graph.cluster(this._data, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: count});
      let nodeList: Array<GraphNode>    = new Array<GraphNode>();

      for (i = 0; i < count; ++i)
      {
        // get the set of nodes for the current cluster
        root  = clusters[i];
        nodes = this._graph.preorder(root);
        color = AppComponent.CLUSTER_COLORS[i];

        this.clusterList.push(nodesToString(nodes));

        // set the rendering properties
        nodeList = nodeList.concat(this.__toGraphNode(nodes, color));
      }

      this._svgContainer.draw(nodeList, this._mst, this._graph.deletedEdges);
    }
  }

  /**
   * Convert a list of {TSMT$INode} references to a list of {GraphNode}s
   *
   * @param {Array<TSMT$INode>} nodes Input node list
   *
   * @param {string} color hex color to be applied to each node in the list
   *
   * @returns {Array<GraphNode>}
   * @private
   */
  protected __toGraphNode(nodes: Array<TSMT$INode>, color: string): Array<GraphNode>
  {
    const m: number = nodes.length;
    let j: number;
    let g: Array<GraphNode> = new Array<GraphNode>();

    // add color and radius to the existing node data
    for (j = 0; j < m; ++j) {
      g.push( {...nodes[j], "color": color, "radius": AppComponent.DEFAULT_RADIUS} );
    }

    return g;
  }

  /**
   * Execute when the external model is loaded; the model contains the node layout
   *
   * @param {LayoutModel} data Layout data
   *
   * @returns {nothing}
   *
   * @private
   */
  protected __onModelLoaded(data: LayoutModel): void
  {
    if (data)
    {
      this._data       = JSON.parse(JSON.stringify(data));
      this.layoutTitle = data.layout;

      const n: number = data.nodes.length;
      this.nodeCount  = n.toString();

      const nodeList: Array<GraphNode> = this.__toGraphNode(< Array<TSMT$INode> > data['nodes'], AppComponent.DEFAULT_NODE_COLOR);

      const clusters: Array<TSMT$INode> = this._graph.cluster(data, TSMT_CLUSTER_TYPE.BY_NUMBER, {clusters: 1});

      this._mst = this._graph.getMST();

      const nodes: Array<TSMT$INode> = this._graph.preorder(clusters[0]);

      this.clusterList.push(nodesToString(nodes));

      this._svgContainer.draw(nodeList, this._mst);
    }
  }
}
