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
 * Attribute directive used to provide an SVG canvas for rendering vertices in the layout, MST, and clusters
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import { Directive
       , ElementRef
       , OnInit
       , OnChanges
       , SimpleChanges
       , SimpleChange
       , Input
} from '@angular/core';

import * as SVG from 'svg.js';
import { GraphNode } from '../models/models';

import { TSMT$IEdge } from '../libs/SimpleGraph';

@Directive({
  selector: '[svgContainer]'
})
export class SvgContainerDirective implements OnInit, OnChanges
{
  // top/right bounds in user coordinates (left/bottom is the origin) - these are to be set only once for the demo
  @Input('top')
  protected _top: number = 1;

  @Input('right')
  protected _right: number = 1;

  protected _div: HTMLDivElement;        // direct reference to the <div> for possible future use

  protected _canvas: SVG.Doc;            // SVG Doc that serves as a Canvas

  // container dimensions in pixels
  protected _width: number;
  protected _height: number;

  // pixels per unit x and y
  protected _pxPerUnitX: number;
  protected _pxPerUnitY: number;

  /**
   * Construct a new SVG Container directive
   *
   * @param {ElementRef} _elementRef Injected element ref
   *
   * @returns {nothing}
   */
  constructor(protected _elementRef: ElementRef)
  {
    this._width      = 0;
    this._height     = 0;
    this._pxPerUnitX = 0;
    this._pxPerUnitY = 0;
  }

  /**
   * Angular lifecycle method - on changes
   *
   * @param {SimpleChanges} changes {Object} associating properties with an instance of {SimpleChange}
   *
   * @returns {nothing}
   */
  public ngOnChanges(changes: SimpleChanges): void
  {
    let prop: string;

    for (prop in changes)
    {
      // TODO Implement if you want to support dynamically changing the user extents (top/right)
    }
  }

  /**
   * Angular lifecycle on init
   *
   * @returns {nothing} Initializes the SVG Canvas and prepares for rendering
   */
  public ngOnInit(): void
  {
    this._div        = this._elementRef.nativeElement;
    this._width      = this._div.clientWidth;
    this._height     = this._div.clientHeight;
    this._pxPerUnitX = this._width/this._right;
    this._pxPerUnitY = this._height/this._top;

    this._canvas = SVG(this._div).size('100%', '100%').viewbox(0, 0, this._width, this._height);
  }

  /**
   * Make a new drawing into the SVG Canvas
   *
   * @param {Array<GraphNode>} nodes Vertex list
   *
   * @param {Array<TSMT$IEdge>} mst Edge collection for the minimum spanning tree
   *
   * @param {Array<TSMT$IEdge>} deletedEdges List of edges that were deleted for clustering (empty array if no
   * deletions)
   */
  public draw(nodes: Array<GraphNode>, mst: Array<TSMT$IEdge>, deletedEdges: Array<TSMT$IEdge> = []): void
  {
    this._canvas.clear();

    const n: number = nodes.length;
    const m: number = mst.length;
    let i: number;
    let x: number;
    let y: number;
    let g: GraphNode;
    let e: TSMT$IEdge;

    const hasDeletions: boolean = deletedEdges.length > 0;

    // draw the MST as one path
    let path: string = '';
    for (i = 0; i < m; ++i)
    {
      e = mst[i];

      if (hasDeletions)
      {
        if (this.__isInList(e, deletedEdges)) {
          continue;
        }
      }

      path += 'M ' + (e.v1.x*this._pxPerUnitX).toString() + ' ' + ((this._top-e.v1.y)*this._pxPerUnitY).toString();
      path += 'L ' + (e.v2.x*this._pxPerUnitX).toString() + ' ' + ((this._top-e.v2.y)*this._pxPerUnitY).toString();
    }

    this._canvas.path(path).stroke({width: 2, color: '#ccc'});

    // draw the nodes
    for (i = 0; i < n; ++i)
    {
      g = nodes[i];
      x = this._pxPerUnitX*g.x;
      y = (this._top - g.y)*this._pxPerUnitY;

      this._canvas.circle(g.radius).attr({cx: x, cy: y}).fill(g.color);

      // this is approximate given the font size and 'close enough for purposes of the demo'
      this._canvas.text(g.key).font({family: 'Arial', size: 12, anchor: 'middle'}).attr({x: x, y: y-g.radius+3}).fill('#fff');
    }
  }

  /**
   * Is an edge in the provided list?
   *
   * @param {TSMT$IEdge} e Edge
   *
   * @param {Array<TSMT$IEdge>} list Edge list to test against
   *
   * @returns {boolean} True if the input edge was found in the list; false otherwise
   * @private
   */
  protected __isInList(e: TSMT$IEdge, list: Array<TSMT$IEdge>): boolean
  {
    let n: number = list.length;
    let i: number;
    let l: TSMT$IEdge;

    for (i = 0; i < n; ++i)
    {
      l = list[i];
      if (e.v1.key === l.v1.key && e.v2.key === l.v2.key) {
        return true;
      }
    }
    return false;
  }
}
