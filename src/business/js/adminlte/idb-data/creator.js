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

import Array from "@sharedJs/helpers/array";
import {getCleanDeepDiff} from "@sharedJs/helpers/deepDiff";
import Uuid from "@sharedJs/helpers/uuid";
import DataTypes from "@sharedJs/helpers/dataTypes";

let model;
let oldDatabase;
let setUuid = '';
let oldData = '';
/**
 * Ajax get model, security reason.
 */
$.get(getModelURL).done((data) => {
    model = data;
    if (typeof model === 'string') {
        model = JSON.parse(model);
    }
    oldData = _.cloneDeep(model.data);
    if (oldData === undefined) {
        oldData = [];
    }
    oldDatabase = _.cloneDeep(model.database);
    if (oldDatabase === undefined) {
        oldDatabase = [];
    }
    if (model.data === undefined) {
        model.data = [];
        model.display_name = '';
        model.uuid = Uuid.generateUuid();
    }
    if (model.used_for === undefined) {
        model.used_for = '';
    }
    rerenderCreate();
    $('.loading').addClass('hidden');
    $('#creator-container').removeClass('hidden');
});
$(document).on('click', '.button--add-set', e => {
    addSet(e.target.dataset.uuid);
});
$(document).on('click', '.button--add-type', e => {
    addType(e.target.dataset.uuid);
});
$(document).on('click', '.creator-remove', e => {
    removeElement(e.target.dataset.uuid);
    if ($('input:invalid').length === 0 && $('.btn-create').attr('disabled') !== undefined) {
        $('.btn-create').removeAttr('disabled');
    }
});
$(document).on('click', '.button--add-predefined-type', e => {
    setUuid = e.target.dataset.uuid;
    $('#types-modal').modal();
});
$(document).on('click', '.button--add-predefined-set', e => {
    setUuid = e.target.dataset.uuid;
    $('#sets-modal').modal();
});
$('#add-selected-type').click(e => {
    let index = $('#selected-type').val();
    DataTypes.addToDom(setUuid, model, types[index]);
    rerenderCreate();
});
$('#add-selected-set').click(e => {
    let index = $('#selected-set').val();
    DataTypes.addToDom(setUuid, model, sets[index]);
    rerenderCreate();
});

$(document).on('change', '.data-creator-set input', e => {
    if (e.target.type !== 'checkbox') {
        editValue(e.target.dataset.uuid, e.target.dataset.key, e.target.value)
    } else {
        editValue(e.target.dataset.uuid, e.target.dataset.key, e.target.checked)
    }
    if ($('input:invalid').length === 0 && $('.btn-create').attr('disabled') !== undefined) {
        $('.btn-create').removeAttr('disabled');
    }
});
$('.btn-create').click(e => {
    addDatabaseNode();
    addColumnsNode();
    if ($('input:invalid').length > 0) {
        $('#data-client-create').addClass('show-invalid');
        $('.btn-create').attr('disabled', 'disabled');

        $('.danger-message').text(emptyDisplayNameMessage);

        $('html').animate({scrollTop: 0}, 400);
        $('.alert-danger').slideDown(400);
    } else {
        DataTypes.addEditNode(model, oldDatabase);

        let diff = getCleanDeepDiff(oldData, model.data);

        let data = {
            diff,
            edit: model.edit,
            database: model.database,
            columns: model.columns,
            display_name: model.display_name,
            used_for: model.used_for,
            uuid: model.uuid
        };
        $.ajax({
            type: 'POST',
            url: createURL,
            data: data,
        }).done(data => {
            if (data) {
                window.location.replace(showAllURL);
            }
        });
        $('.loading').removeClass('hidden');
        let time = setTimeout(() => {
            $('.loading').addClass('hidden');
            alert('Something went wrong! Try again later.');
        }, 30000);
    }
});

function removeElement(uuid) {
    DataTypes.removeFromModel(uuid, model);
    rerenderCreate();
}

function editValue(uuid, key, value) {
    DataTypes.editValueInModel(uuid, key, value, model);
}

function addSet(uuid) {
    DataTypes.addToDom(uuid, model, {
        uuid: Uuid.generateUuid(),
        data: [],
        used_for: '',
        required: 1,
        object_type: 'set',
        display_name: 'test'
    });
    rerenderCreate();
}

function addType(uuid) {
    DataTypes.addToDom(uuid, model, {
        uuid: Uuid.generateUuid(),
        internal_name: '',
        display_name: '',
        data_type: 'string',
        searchable: 1,
        sortable: 1,
        sensitive: 1,
        tag: '',
        used_for: 'us',
        required: 1,
        object_type: 'type',
    });
    rerenderCreate();
}

/**
 * Recursive Function to render set.
 */
function renderSet(model) {
    let html = '<div class="data-creator-set">';
    html += '<div data-uuid="' + model.uuid + '" class="creator-remove glyphicon glyphicon-trash"></div>';
    html += '<div class="set-header">';
    if (model.order !== undefined) {
        html += '<span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span>';
    }

    html += '<label class="display-name">Display Name: </label><input required data-key="display_name" class="form-control header-creator-input" data-uuid="' + model.uuid + '" type="text" name="set" value="' + model.display_name + '"/>';
    html += '<button aria-expanded="true" aria-controls="toggle-' + model.uuid + '" class="toggle-button" data-toggle="collapse" data-target="#toggle-' + model.uuid + '"><span class="glyphicon glyphicon-collapse-up"></span></button>';
    html += '</div>';
    html += '<div class="collapse in sortable" id="toggle-' + model.uuid + '">';
    const isIterable = object =>
        object != null && typeof object[Symbol.iterator] === 'function';
    if (isIterable(model.data)) {
        for (let data of model.data) {
            if (data.object_type === 'type') {
                if (data.tag === null) {
                    data.tag = '';
                }
                let required = false;
                if (data.required !== undefined) {
                    if (data.required === 1) {
                        data.required = 'true';
                    }
                    required = (data.required === 'true');
                }
                let sensitive = false;
                if (data.sensitive !== undefined) {
                    if (data.sensitive === 1) {
                        data.sensitive = 'true';
                    }
                    sensitive = (data.sensitive === 'true');
                }
                html += '<div class="data-creator--type">';

                html += '<span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span>';
                html += '<div style="color: rgb(51, 51, 51);" data-uuid="' + data.uuid + '" class="creator-remove glyphicon glyphicon-trash"></div>';
                html += '<label class="display-name">Display Name:</label>';
                html += '<label>Required: </label><span><input type="checkbox" data-key="required" data-uuid="' + data.uuid + '" name="required" ' + (required ? 'checked="true"' : '') + '"/></span>';
                html += '<label>Sensitive: </label><span><input type="checkbox" data-key="sensitive" data-uuid="' + data.uuid + '" name="sensitive" ' + (sensitive ? 'checked="true"' : '') + '"/></span>';
                html += '<input class="form-control creator-input" required type="text" data-key="display_name" data-uuid="' + data.uuid + '" name="type" value="' + data.display_name + '" />';

                html += '</div>';
            } else if (data.object_type === 'set') {
                html += renderSet(data);
            }
        }
    }
    html += '<div class="data-creator-buton-container">';
    html += '<button class="btn btn-app-blue button--add-type btn-own-orange" data-uuid="' + model.uuid + '">Add Type</button>';
    html += '<button class="btn btn-app-blue button--add-predefined-type btn-predefined btn-own-orange" data-uuid="' + model.uuid + '">Add Predefined Type</button>';
    html += '<button class="btn btn-adn button--add-set btn-own-orange" data-uuid="' + model.uuid + '">Add Set</button>';
    html += '<button class="btn btn-adn button--add-predefined-set btn-predefined btn-own-orange" data-uuid="' + model.uuid + '">Add Predefined Set</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
}

function sort(data) {
    for (let i = 0; i < data.data.length; i++) {
        data.data[i].order = i + 1;
    }
}

function addDatabaseNode() {
    model.database = DataTypes.findDataTypes(model);
}

function addColumnsNode() {
    model.columns = DataTypes.findColumns(model);
}

function searchModelToSort(uuid, model, oldIndex, newIndex) {
    if (model.uuid === uuid) {
        Array.move(model.data, oldIndex, newIndex);
        sort(model);
        rerenderCreate();
        return true;
    }
    for (let data of model.data) {
        if (data.object_type === 'set') {
            if (searchModelToSort(uuid, data, oldIndex, newIndex)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Function to rerender creator form.
 */
function rerenderCreate() {
    $('#data-client-create').html(renderSet(model));
    addDatabaseNode();
    addColumnsNode();
    for (let object of document.querySelectorAll('.sortable')) {
        Sortable.create(object, {
            draggable: '.data-creator--type, .data-creator-set',
            animation: 150,
            group: 'nested',
            fallbackOnBody: true,
            handle: '.ui-sortable-handle',
            onEnd: (evt) => {
                if (evt.from.id !== evt.to.id) {
                    let from = DataTypes.searchSet(evt.from.id.split('toggle-')[1], model);
                    let data;
                    if (from !== false) {
                        data = from.data[evt.oldIndex];
                        from.data.splice(evt.oldIndex, 1);
                        sort(from);
                    }
                    let to = DataTypes.searchSet(evt.to.id.split('toggle-')[1], model);
                    if (to !== false) {
                        to.data.splice(evt.newIndex, 0, data);
                        sort(to);
                        rerenderCreate();
                    }
                } else {
                    searchModelToSort(evt.to.id.split('toggle-')[1], model, evt.oldIndex, evt.newIndex);
                }
            }
        });
    }
}

/**
 ################################################################################
 #                                End of file                                   #
 ################################################################################
 */
