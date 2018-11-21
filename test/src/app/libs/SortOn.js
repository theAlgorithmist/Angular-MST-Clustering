"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Angular Dev Toolkit - Typescript implementation of a sort-on, i.e. sort an Array of Objects on one or more (numeric)
 * properties
 *
 * @param {Array<Object>} data Data array to be sorted
 *
 * @param {Array<string>} sortProps List of {Object} properties to sort on in the order provided, e.g. sort on 'priority' first,
 * and then by 'time'.
 *
 * @param {boolean} increasing True if data is to be sorted in increasing order
 * @default true
 *
 * @returns nothing The original Array is sorted in-place in order specified by the {increasing} argument
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
function sortOn(data, sortProps, increasing = true) {
    if (sortProps === undefined || (sortProps.length && sortProps.length == 0)) {
        return;
    }
    data.sort(function (a, b) {
        let props = sortProps.slice();
        let prop = props.shift();
        while (a[prop] == b[prop] && props.length) {
            prop = props.shift();
        }
        if (increasing) {
            // return data in increasing numerical order
            return a[prop] == b[prop] ? 0 : a[prop] > b[prop] ? 1 : -1;
        }
        else {
            // return data in decreasing numerical order
            return a[prop] == b[prop] ? 0 : a[prop] < b[prop] ? 1 : -1;
        }
    });
    return;
}
exports.sortOn = sortOn;
//# sourceMappingURL=SortOn.js.map