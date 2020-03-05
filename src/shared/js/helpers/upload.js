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

import SparkMD5 from "spark-md5";

export default class Upload {
    static dropZone(id) {
        let uploadButton = document.getElementById(id);
        if (uploadButton === null) {
            return;
        }

        uploadButton.ondrop = evt => {
            evt.preventDefault();
            evt.stopPropagation();
            let dataTransfer = new DataTransfer();
            dataTransfer.items.add(evt.dataTransfer.files.item(0));
            document.querySelector('input[type="file"]').files = dataTransfer.files;

            $('input[type="file"]').change();
            $(uploadButton).removeClass('dragged-over');
        };

        uploadButton.ondragover = evt => {
            evt.preventDefault();
        };

        uploadButton.ondragenter = evt => {
            evt.preventDefault();
            $(uploadButton).addClass('dragged-over');
        };

        uploadButton.ondragleave = evt => {
            evt.preventDefault();
            $(uploadButton).removeClass('dragged-over');
        };
    }

    static md5File(file, upload) {
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunkSize = (512 * 1024), // Read in chunks of 512kB
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();

        fileReader.onload = function (e) {
            let md5Progress = ((chunks > 0) ? ((currentChunk + 1) * 100 / chunks) : "100");
            let width = Math.round(md5Progress) + '%';
            $("#pb").html(width);
            $("#pb").width(width);

            spark.append(e.target.result);
            currentChunk++;

            if (currentChunk < chunks) {
                loadNext();
            } else {
                upload(spark.end(), file);
            }
        };

        fileReader.onerror = function () {
            console.warn('error calculating checksum ...');
        };

        function loadNext() {
            let start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
            let blob = blobSlice.call(file, start, end);
            fileReader.readAsArrayBuffer(blob);
        }

        loadNext();
    }
}

/**
 ################################################################################
 #                                End of file                                   #
 ################################################################################
 */
