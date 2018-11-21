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
 * All models used in the MST-Clustering demo
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

import { TSMT$INode } from '../libs/SimpleGraph';

/**
 * Model for a graphical node that is rendered in an SVG Canvas
 */
export interface GraphNode extends TSMT$INode
{
  color: string;
  radius: number;
}

export interface LayoutModel
{
  layout: string;              // title of this layout
  nodes: Array<TSMT$INode>;    // list of nodes or vertices in the layout
}
