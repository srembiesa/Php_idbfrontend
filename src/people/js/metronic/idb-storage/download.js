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

import {downloadInit} from '../../../../shared/js/helpers/download';
let timerInterval = null;
$(document).ready(() => {
    downloadInit();
    function setDownloadText() {
        if (secondsBeforeDownloading === 0){
            $('#download-counter').html(startedTxt);
            downloadFile(downloadUrl);
            clearInterval(timerInterval);
        } else {
            $('#download-counter').html(downloadTxt + secondsBeforeDownloading + secondsTxt);
            secondsBeforeDownloading--;
        }
    }

    let secondsBeforeDownloading = 5;
    timerInterval = setInterval(setDownloadText, 1000);
});

$(window).on('beforeunload', () => {
    clearInterval(timerInterval);
});

/**
 ################################################################################
 #                                End of file                                   #
 ################################################################################
 */
