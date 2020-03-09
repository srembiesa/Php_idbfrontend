/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * https://github.com/wenzhixin/bootstrap-show-password
 * version: 1.1.2
 */

!function ($) {

    'use strict';

    // TOOLS DEFINITION
    // ======================

    // it only does '%s', and return '' when arguments are undefined
    var sprintf = function (str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        if (flag) {
            return str;
        }
        return '';
    };

    // PASSWORD CLASS DEFINITION
    // ======================

    var Password = function (element, options) {
        this.options = options;
        this.$element = $(element);
        this.isShown = false;

        this.init();
    };

    Password.DEFAULTS = {
        placement: 'after', // 'before' or 'after'
        white: false, // v2
        message: 'Click here to show/hide password',
        eyeClass: 'fas',
        eyeOpenClass: 'fa-eye',
        eyeCloseClass: 'fa-eye-slash',
        eyeClassPositionInside: false
    };

    Password.prototype.init = function () {
        var placementFuc,
            inputClass; // v2 class

        if (this.options.placement === 'before') {
            placementFuc = 'insertBefore';
            inputClass = 'input-prepend';
        } else {
            this.options.placement = 'after'; // default to after
            placementFuc = 'insertAfter';
            inputClass = 'input-append';
        }

        // Create the text, icon and assign
        this.$element.wrap(sprintf('<div class="%s input-group" />', inputClass));

        this.$text = $('<input type="text" />')
            [placementFuc](this.$element)
            .attr('class', this.$element.attr('class'))
            .attr('style', this.$element.attr('style'))
            .attr('placeholder', this.$element.attr('placeholder'))
            .css('display', this.$element.css('display'))
            .val(this.$element.val()).hide();

        // Copy readonly attribute if it's set
        if (this.$element.prop('readonly'))
            this.$text.prop('readonly', true);
        this.$icon = $([
            '<span tabindex="100" title="' + this.options.message + '" class="add-on input-group-addon">',
            '<i class="icon-eye-open' + (this.options.white ? ' icon-white' : '') +
            ' ' + this.options.eyeClass + ' ' + (this.options.eyeClassPositionInside ? '' : this.options.eyeOpenClass) + '">' +
            (this.options.eyeClassPositionInside ? this.options.eyeOpenClass : '') + '</i>',
            '</span>'
        ].join(''))[placementFuc](this.$text).css('cursor', 'pointer');

        // events
        this.$text.off('keyup').on('keyup', $.proxy(function () {
            if (!this.isShown) return;
            this.$element.val(this.$text.val()).trigger('change');
        }, this));

        this.$icon.off('click').on('click', $.proxy(function () {
            this.$text.val(this.$element.val()).trigger('change');
            this.toggle();
        }, this));
    };

    Password.prototype.toggle = function (_relatedTarget) {
        this[!this.isShown ? 'show' : 'hide'](_relatedTarget);
    };

    Password.prototype.show = function (_relatedTarget) {
        var e = $.Event('show.bs.password', {relatedTarget: _relatedTarget});
        this.$element.trigger(e);

        this.isShown = true;
        this.$element.hide();
        this.$text.show();
        if (this.options.eyeClassPositionInside) {
            this.$icon.find('i')
                .removeClass('icon-eye-open')
                .addClass('icon-eye-close')
                .html(this.options.eyeCloseClass);
        } else {
            this.$icon.find('i')
                .removeClass('icon-eye-open ' + this.options.eyeOpenClass)
                .addClass('icon-eye-close ' + this.options.eyeCloseClass);
        }

        // v3 input-group
        this.$text[this.options.placement](this.$element);
    };

    Password.prototype.hide = function (_relatedTarget) {
        var e = $.Event('hide.bs.password', {relatedTarget: _relatedTarget});
        this.$element.trigger(e);

        this.isShown = false;
        this.$element.show();
        this.$text.hide();
        if (this.options.eyeClassPositionInside) {
            this.$icon.find('i')
                .removeClass('icon-eye-close')
                .addClass('icon-eye-open')
                .html(this.options.eyeOpenClass);
        } else {
            this.$icon.find('i')
                .removeClass('icon-eye-close ' + this.options.eyeCloseClass)
                .addClass('icon-eye-open ' + this.options.eyeOpenClass);
        }

        // v3 input-group
        this.$element[this.options.placement](this.$text);
    };

    Password.prototype.val = function (value) {
        if (typeof value === 'undefined') {
            return this.$element.val();
        } else {
            this.$element.val(value).trigger('change');
            this.$text.val(value);
        }
    };

    Password.prototype.focus = function () {
        this.$element.focus();
    };


    // PASSWORD PLUGIN DEFINITION
    // =======================

    var old = $.fn.password;

    $.fn.password = function () {
        var option = arguments[0],
            args = arguments,

            value,
            allowedMethods = [
                'show', 'hide', 'toggle', 'val', 'focus'
            ]; // public function

        this.each(function () {
            var $this = $(this),
                data = $this.data('bs.password'),
                options = $.extend({}, Password.DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw "Unknown method: " + option;
                }
                value = data[option](args[1]);
            } else {
                if (!data) {
                    data = new Password($this, options);
                    $this.data('bs.password', data);
                } else {
                    data.init(options);
                }
            }
        });

        return value ? value : this;
    };

    $.fn.password.Constructor = Password;


    // PASSWORD NO CONFLICT
    // =================

    $.fn.password.noConflict = function () {
        $.fn.password = old;
        return this;
    };

    $(function () {
        $('[data-toggle="password"]').password();
    });

}(window.jQuery);

passwordPolicy = JSON.parse(passwordPolicyJson);

const digitSet = '0123456789';
const lowerSet = 'zaqxswcdevfrbgtnhymjukilop';
const upperSet = 'ZAQXSWCDEVFRBGTNHYMJUKILOP';
let generated = false;
let progressClass = '';

let tests = {
    lower: new RegExp('(?:[a-z].*){' + passwordPolicy.lowercase + ',}'),
    upper: new RegExp('(?:[A-Z].*){' + passwordPolicy.uppercase + ',}'),
    digit: new RegExp('(?:\\d.*){' + passwordPolicy.digit + ',}'),
    special: new RegExp('(?:[' + passwordPolicy.special_chars_set + '].*){' + passwordPolicy.lowercase + ',}'),
    length: new RegExp('.{20,}')
};

function updateScore() {
    checkScore($('#idbsignupform-password').val());
}

$('#idbsignupform-password').change(updateScore);
$('#idbsignupform-password').keypress(updateScore);
$('#idbsignupform-password').keyup(updateScore);
$('#idbsignupform-password').blur(updateScore);
$('#idbsignupform-password').focusin(updateScore);
$('#idbsignupform-password').focusout(updateScore);
$('#idbsignupform-password').on('input', updateScore);
$('#idbsignupform-password').on('textInput', updateScore);
$('#idbsignupform-password').on('reset', updateScore);

$(document).ready(() => {
    setTimeout(function () {
        updateScore();
    }, 0);
});

function checkScore(password) {
    let score = 0;
    for (let test in tests) {
        if (tests[test].test(password)) {
            score++;
        }
    }
    $('#progress-strength-meter').removeClass(progressClass);

    if (score == 5) {
        progressClass = 'progress-bar-success';
    } else if (score > 1) {
        progressClass = 'progress-bar-warning';
    } else {
        progressClass = 'progress-bar-danger';
    }
    if (score == 0) {
        score++;
    }

    $('#progress-strength-meter').addClass(progressClass);
    $('#progress-strength-meter').css('width', (score * 20) + '%');
}

$('.password-button').click((e) => {
    if (generated) {
        generated = false;
        $('#idbsignupform-password').val('');
        $('#idbsignupform-repeatpassword').val('');

        $('#generate-password-container').slideUp(400, () => {
            $('#type-password-container').slideDown(400);
        });
    } else {
        generated = true;
        let password = generatePassword();
        $('#idbsignupform-password').val(password);
        $('#idbsignupform-repeatpassword').val(password);

        $('#text-generate-pass').html(password);

        $('#type-password-container').slideUp(400, () => {
            $('#generate-password-container').slideDown(400);
        });
    }
});

$("#copy-link-button").click(e => {
    e.preventDefault();
    navigator.clipboard.writeText(document.querySelector('#text-generate-pass').innerText);

    $('#copy-link-button').text(copiedTxt).prop('disabled', true);
    $('#copy-link-button').removeClass("btn-warning").addClass("btn-success");

    setTimeout(function () {
        $('#copy-link-button').removeClass("btn-success").addClass("btn-warning");
        $('#copy-link-button').text(copyTxt).prop('disabled', false);
    }, 10000);
});

/**
 * @returns {string}
 */
function generatePassword() {
    let password = '';
    password += generateFromSet(digitSet, passwordPolicy.digit);
    password += generateFromSet(passwordPolicy.special_chars_set, passwordPolicy.special);
    password += generateFromSet(lowerSet, passwordPolicy.lowercase);
    password += generateFromSet(upperSet, passwordPolicy.uppercase);
    if (parseInt(password.length) < parseInt(passwordPolicy.max_length)) {
        let minTmp = parseInt(password.length) < parseInt(passwordPolicy.min_length) ? passwordPolicy.min_length : password.length;
        if (minTmp < 64) minTmp = 64;
        let completeLength = Math.floor((Math.random() * (parseInt(passwordPolicy.max_length) - parseInt(minTmp))) + parseInt(minTmp));
        password += generateFromSet(
            passwordPolicy.special_chars_set + digitSet + lowerSet + upperSet,
            completeLength - password.length
        );
    }

    return password.split('').sort(function () {
        return 0.5 - Math.random()
    }).join('');
}

/**
 * @param set
 * @param length
 * @returns {string}
 */
function generateFromSet(set, length) {
    let text = '';
    for (let i = 0; i < length; i++) {
        text += set[Math.floor((Math.random() * set.length))];
    }

    return text;
}
