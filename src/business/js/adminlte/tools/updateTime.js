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
 * @return {string}
 */
function ConvertHours(num) {
    let d = Math.floor(num / 24); // 60*24
    let h = Math.floor((num - (d * 24)));

    if (d > 0) {
        return (d + dayMessage + ", " + h + " " + hourMessage);
    } else {
        return (h + " " + hourMessage);
    }
}

$('#businessretentionperiodform-maximum').change(e => {
    let hours = parseInt(e.target.value);
    if (!isNaN(hours)) {
        $('#maximum-txt').html(" (" + ConvertHours(hours) + ")");
    } else {
        $('#maximum-txt').html("");
    }
});

$('#businessretentionperiodform-minimum').change(e => {
    let hours = parseInt(e.target.value);
    if (!isNaN(hours)) {
        $('#minimum-txt').html(" (" + ConvertHours(hours) + ")");
    } else {
        $('#minimum-txt').html("");
    }
});

$('#businessretentionperiodform-reviewcycle').change(e => {
    let hours = parseInt(e.target.value);
    if (!isNaN(hours)) {
        $('#review-txt').html(" (" + ConvertHours(hours) + ")");
    } else {
        $('#review-txt').html("");
    }
});

/**
 ################################################################################
 #                                End of file                                   #
 ################################################################################
 */
