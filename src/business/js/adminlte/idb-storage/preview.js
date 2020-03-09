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

import pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Asynchronous download of PDF
let loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {

    // Fetch the first page
    let pageNumber = 1;
    pdf.getPage(pageNumber).then(function(page) {

        let scale = 1.5;
        let viewport = page.getViewport({scale: scale});

        // Prepare canvas using PDF page dimensions
        let canvas = document.getElementById('canvas-preview');
        let context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        let renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        let renderTask = page.render(renderContext);
    });
}, function (reason) {
    // PDF loading error
    console.error(reason);
});

/**
 ################################################################################
 #                                End of file                                   #
 ################################################################################
 */
