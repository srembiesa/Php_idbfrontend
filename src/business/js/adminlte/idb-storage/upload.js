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

Upload.dropZone('button-upload');

let isLoaded = false;

function getSharedData(success) {
    $.get(getUsersUrl, (data) => {

        let sharedObj = JSON.parse(shared);
        let dataObj = JSON.parse(data);
        for (let index in dataObj) {
            if (sharedObj[dataObj[index].id] !== undefined) {
                dataObj[index].selected = true;
            }
        }

        $('#change-share-input').select2({
            dropdownParent: $("#idbStorageShareChange"),
            data: dataObj
        });

        $('#request-file-input').select2({
            dropdownParent: $("#idbStorageRequestUpload"),
            data: dataObj
        });

        isLoaded = true;
        success();
    });
}

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

                if(uuid === "")  {
                    $('#idbStorageShareChange').modal('show');
                } else {
                    $('#shareTemplate').submit();
                }

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

$('#change-share').click(() => {
    if (preload) {
        $('.loading').show();
        getSharedData(() => {
            $('.loading').hide();
            $('#idbStorageShareChange').modal();
        });
    } else {
        $('#idbStorageShareChange').modal();
    }
});

$('#share-everyone').change(e => {
    if (e.target.checked) {
        $('#select-people').slideUp(400);
    } else {
        if (isLoaded) {
            $('#select-people').slideDown(400);
        } else {
            $('.loading').show();
            getSharedData(() => {
                $('.loading').hide();
                $('#select-people').slideDown(400);
            });
        }
    }
});

$('#upload-request-button').click(e => {
    if (!isLoaded) {
        $('.loading').show();
        getSharedData(() => {
            $('.loading').hide();
            $('#idbStorageRequestUpload').modal();
        });
    } else {
        $('#idbStorageRequestUpload').modal();
    }
});

$('.clickable-row td:not(.click-disabled)').click(e => {
    location.href = $(e.target).closest('tr').data('href');
});

$('#button-upload').click(e => {
    $('input[type="file"]').click();
});

$('#show-all-requests').change(e => {
    $.get(showInactiveUrl + '?showRequests=' + e.target.value, (data) => {
    });
});

$('#show-all-files').change(e => {
    $.get(showAllUserFilesUrl + '?all=' + e.target.checked, (data) => {
    });
});

/**
 ################################################################################
 #                                End of file                                   #
 ################################################################################
 */
