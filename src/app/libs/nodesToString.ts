/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
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


import { TSMT$INode } from './SimpleGraph';

/**
 * A simple function to create a comma-delimited string of node keys given an array of nodes
 *
 * @param {Array<TSMT$INode>} Node list
 *
 * @returns {string} comma-delimited list of node keys, i.e. "a, b, c, d".
 */
export function nodesToString(nodes: Array<TSMT$INode>): string
{
  const n: number  = nodes.length;
  let list: string = '';

  if (n > 0)
  {
    list = nodes[0].key;
    let i: number;

    for (i = 1; i < n; ++i) {
      list += ', ' + nodes[i].key;
    }
  }

  return list;
}
