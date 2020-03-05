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

$('.edit-title').click(e => {
    e.stopPropagation();

    $('#title-group-' + e.target.dataset.dbid).slideDown(400);
});

$('.btn-edit-title').click(e => {
    e.stopPropagation();

    let request = {
        dbid: e.target.dataset.dbid,
        name: $('input[name=' + e.target.dataset.dbid + ']').val()
    };

    if (request.name === '') {
        $('html').animate({scrollTop: 0}, 400);
        $('.danger-message').html(emptyMessage);
        $('.alert-danger').slideDown(400);
        return;
    }

    $.post(editURL, request, data => {
        data = JSON.parse(data);
        if (data.success) {
            let fontSize = '38px';

            if (request['name'].length > 15) {
                fontSize = '18px';
            } else if (request['name'].length > 10) {
                fontSize = '24px';
            } else if (request['name'].length > 8) {
                fontSize = '32px';
            }

            $('#db-name-h3-' + request.dbid + ' span').html(request.name);
            $('#db-name-h3-' + request.dbid).css({fontSize});
            $('#title-group-' + request.dbid).slideUp(400);

            $('html').animate({scrollTop: 0}, 400);
            $('.success-message').html(successMessage);
            $('.alert-success').slideDown(400);
        } else {
            $('html').animate({scrollTop: 0}, 400);
            $('.danger-message').html(dangerMessage);
            $('.alert-danger').slideDown(400);
        }
    });
});

$('.btn-close-title').click(e => {
    e.stopPropagation();
    $('#title-group-' + e.target.dataset.dbid).slideUp(400);
});

$('.btn-close-desc').click(e => {
    e.stopPropagation();

    $('#desc-group-' + e.target.dataset.dbid).slideUp(400);
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

$('.edit-desc').click(e => {
    e.stopPropagation();

    $('#desc-group-' + e.target.dataset.dbid).slideDown(400);
});

$('.btn-edit-desc').click(e => {
    e.stopPropagation();

    let request = {
        dbid: e.target.dataset.dbid,
        description: $('#desc-area-' + e.target.dataset.dbid).val()
    };

    request.description = request.description.replace(/<[^>]+>/g, '');

    $.post(editURL, request, data => {
        data = JSON.parse(data);
        if (data.success) {
            $('#db-desc-p-' + request.dbid + ' span').html(request.description);
            $('#desc-group-' + request.dbid).slideUp(400);
            $('.success-message').html(successMessage);
            $('.alert-success').slideDown(400);
        } else {
            $('html').animate({scrollTop: 0}, 400);
            $('.danger-message').html(dangerMessage);
            $('.alert-danger').slideDown(400);
        }
    });
});

/**
 ################################################################################
 #                                End of file                                   #
 ################################################################################
 */
