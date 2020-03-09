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

import Upload from '../../../../shared/js/helpers/upload';

Upload.dropZone('m-dropzone-two');

function upload(md5, file) {
    if(file.size > uploadLimit) {
        $('#max-file-warning').slideDown(400);

        return;
    }

    $('.progress-container').css('display', 'flex');
    $.get(initObjectUrl, (data) => {
        let storageObject = JSON.parse(data);

        let formInputs = JSON.parse(storageObject.AwsS3Post);
        let oId = storageObject.QueryData[0][2];
        let key = JSON.parse(storageObject.QueryData[0][6]).s3_key;
        $('#upload-form').attr('action', formInputs.formAttributes.action);

        let inputs = '';
        for (let input in formInputs.formInputs) {
            inputs += '<input type="hidden" name="' + input + '" value="' + formInputs.formInputs[input] + '" />';
        }

        $('input[name="shareKey"]').val(key);
        $('input[name="shareOid"]').val(oId);

        $('#upload-form .hidden-inputs').html(inputs);

        jQuery.ajax({
            xhr: () => {
                let xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        let percentComplete = (evt.loaded / evt.total) * 100;
                        $('.progress-container .progress-bar').css('width', percentComplete + '%');
                    }
                }, false);
                return xhr;
            },
            url: $('#upload-form').attr('action'),
            data: new FormData(document.querySelector('#upload-form')),
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            type: 'POST',
            success: (data) => {
                let extension = '.' + file.name.split('.').pop();
                let key = $('input[name="key"]').val() + extension;
                let filename = file.name.replace(/[&\/\\#+$%'":*?<>{}]/g,'_');
                $('input[name="success_action_redirect"]').val($('input[name="success_action_redirect"]').val() + '?key=' + key + '&name=' + filename + '&size=' + file.size + '&checksum=' + md5);
                $('input[name="shareName"]').val(filename);
                $('input[name="shareChecksum"]').val(md5);
                $('input[name="shareSize"]').val(file.size);

                $('#complete-upload-form').submit();
                $('.progress-container').css('display', 'none');
                $('.progress-container .progress-bar').css('width', '0%');
            }
        });
    });
}

$('input[type="file"]').change((e) => {
    let file = $('input[type="file"]')[0].files[0];

     if (file) {
        Upload.md5File(file, upload);
    }
});

$('#click-upload').click(e => {
   $('input[type="file"]').click();
});

$('.clickable-row td:not(.click-disabled)').click(e => {
    location.href= $(e.target).closest('tr').data('href');
});

$('.file-summaries-button').click(e => {
    $('.loading').show();
    $.get(summariesUrl + '?oid=' + e.target.dataset.objectOid, data => {
        let summary = JSON.parse(data);
        try {
            $('#summary-download').attr('href', summary.download);
            $('#summary-name').html(summary.name);
            $('#summary-createtime').html(summary.createTime);
            $('#summary-size').html(summary.size);
            $('#summary-checksum').html(summary.metadata.checkSum);
            $('#summary-downloads').html((summary.attributes.downloads) !== undefined ? summary.attributes.downloads : "0");
        } catch(error) {
            $('#summary-download').attr('href', '#');
            $('#summary-name').html('<strong>File deleted by owner</strong>');
            $('#summary-createtime').html('');
            $('#summary-size').html('');
            $('#summary-checksum').html('');
            $('#summary-downloads').html('');
        }

        $('.loading').hide();
        $('#summary-modal').modal();
    });
});

/**
 ################################################################################
 #                                End of file                                   #
 ################################################################################
 */
