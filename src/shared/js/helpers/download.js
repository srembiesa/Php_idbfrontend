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

export let downloadInit = function() {
    window.downloadFile = function (sUrl) {
        if (/(iP)/g.test(navigator.userAgent)) {
            alert('Your device does not support files downloading. Please try again in desktop browser.');
            return false;
        }

        if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
            let link = document.createElement('a');
            link.href = sUrl;

            if (link.download !== undefined) {
                let fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
                link.download = fileName;
            }

            if (document.createEvent) {
                let e = document.createEvent('MouseEvents');
                e.initEvent('click', true, true);
                link.dispatchEvent(e);
                return true;
            }
        }

        if (sUrl.indexOf('?') === -1) {
            sUrl += '?download';
        }

        window.open(sUrl, '_self');
        return true;
    };

    window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
};

/**
 ################################################################################
 #                                End of file                                   #
 ################################################################################
 */
