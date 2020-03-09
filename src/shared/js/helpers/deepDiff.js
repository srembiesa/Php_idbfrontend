/**
# * ********************************************************************* *
# *                                                                       *
# *   Front end for IDB web portals                                       *
# *   This file is part of idbfrontend. This project may be found at:     *
# *   https://github.com/IdentityBank/Php_idbfrontend.                    *
# *                                                                       *
# *   Copyright (C) 2020 by Identity Bank. All Rights Reserved.           *
# *   https://www.identitybank.eu - You belong to you                     *
# *                                                                       *
# *   This program is free software: you can redistribute it and/or       *
# *   modify it under the terms of the GNU Affero General Public          *
# *   License as published by the Free Software Foundation, either        *
# *   version 3 of the License, or (at your option) any later version.    *
# *                                                                       *
# *   This program is distributed in the hope that it will be useful,     *
# *   but WITHOUT ANY WARRANTY; without even the implied warranty of      *
# *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the        *
# *   GNU Affero General Public License for more details.                 *
# *                                                                       *
# *   You should have received a copy of the GNU Affero General Public    *
# *   License along with this program. If not, see                        *
# *   https://www.gnu.org/licenses/.                                      *
# *                                                                       *
# * ********************************************************************* *
*/

/**
 * Class to make deepDiff of 2 objects.
 *
 * Supported: created, updated, deleted.
 */
export let deepDiffMapper = function () {
    return {
        VALUE_CREATED: 'created',
        VALUE_UPDATED: 'updated',
        VALUE_DELETED: 'deleted',
        VALUE_UNCHANGED: 'unchanged',
        map: function (obj1, obj2) {
            if (this.isFunction(obj1) || this.isFunction(obj2)) {
                throw 'Invalid argument. Function given, object expected.';
            }
            if (this.isValue(obj1) || this.isValue(obj2)) {

                if (this.compareValues(obj1, obj2) !== this.VALUE_UNCHANGED) {
                    return {
                        type: this.compareValues(obj1, obj2),
                        data: obj2
                    };
                }

                return null;
            }

            let diff = {};
            for (let key in obj1) {
                if (this.isFunction(obj1[key])) {
                    continue;
                }

                let value2 = undefined;
                if (obj2[key] !== undefined) {
                    value2 = obj2[key];
                }

                diff[key] = this.map(obj1[key], value2);
            }
            for (let key in obj2) {
                if (this.isFunction(obj2[key]) || diff[key] !== undefined) {
                    continue;
                }

                diff[key] = this.map(undefined, obj2[key]);
            }

            return diff;

        },
        compareValues: function (value1, value2) {
            if (value1 === value2) {
                return this.VALUE_UNCHANGED;
            }
            if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
                return this.VALUE_UNCHANGED;
            }
            if (value1 === undefined) {
                return this.VALUE_CREATED;
            }
            if (value2 === undefined) {
                return this.VALUE_DELETED;
            }
            return this.VALUE_UPDATED;
        },
        isFunction: function (x) {
            return Object.prototype.toString.call(x) === '[object Function]';
        },
        isArray: function (x) {
            return Object.prototype.toString.call(x) === '[object Array]';
        },
        isDate: function (x) {
            return Object.prototype.toString.call(x) === '[object Date]';
        },
        isObject: function (x) {
            return Object.prototype.toString.call(x) === '[object Object]';
        },
        isValue: function (x) {
            return !this.isObject(x) && !this.isArray(x);
        }
    }
}();

/**
 * Recursive function to delete nodes with null value.
 *
 * @param obj
 */
export function removeNullObject(obj) {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === "object") removeEmpty(obj[key]);
        else if (obj[key] == null || obj[key] === {}) delete obj[key];
    });
}

/**
 * Recursive function to delete empty nodes.
 * @param obj
 */
export function removeEmptyObject(obj) {
    for (let k in obj) {
        if (!obj[k] || typeof obj[k] !== "object") {
            continue
        }

        removeEmptyObject(obj[k]);
        if (Object.keys(obj[k]).length === 0) {
            delete obj[k];
        }
    }
}

/**
 * Function combines removeEmptyObject and removeNullObject.
 * @param obj
 */
export function removeEmpty(obj) {
    removeNullObject(obj);
    removeEmptyObject(obj);
}

/**
 * Function to get diff of two object without empty objects and null values.
 *
 * @param oldData
 * @param newData
 * @returns {*|{data: *, type: *}|null}
 */
export function getCleanDeepDiff(oldData, newData) {
    let diff = deepDiffMapper.map(oldData, newData);
    removeEmpty(diff);

    return diff;
}

/**
 ################################################################################
 #                                End of file                                   #
 ################################################################################
 */
