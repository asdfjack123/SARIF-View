(function ($) {
    'use strict';
    $.fn.multiDropdown = function (param) {
        let defaultSetting = {
            inputFormat: 1, // 輸入框顯示格式={1.label, 2:value, 3:value-label}
            dropFormat: 1, // 下拉顯示格式={1.label, 2:value, 3:value-label}
            valueName: 'value', // source的value name
            labelName: 'label', // source的label name
            placeholderText: '篩選' // 下拉選單篩選 input 的 placeholder 顯示文字
        };
        let $dropdown = $.extend(defaultSetting, param);
        $dropdown.id = $(this).attr('id');

        $dropdown.init = function (param) {
            $dropdown.destroy();

            if (param.dropFormat == 1) {
                param.showList = param.source.map(x => ({ "value": x[param.valueName], "label": x[param.labelName] }));
            } else if (param.dropFormat == 2) {
                param.showList = param.source.map(x => ({ "value": x[param.valueName], "label": x[param.valueName] }));
            } else if (param.dropFormat == 3) {
                param.showList = param.source.map(x => ({ "value": x[param.valueName], "label": x[param.valueName] + '-' + x[param.labelName] }));
            }

            $("#" + $dropdown.id).focus(function () {
                if ($(this).prop("disabled")) {
                    $(this).blur();
                } else {
                    $(this).parent().addClass('active');
                }
            });

            let selectItems = $('<div class="select-items"></div>');
            let searchBox = $('<div class="select-items-search"></div>').appendTo(selectItems);
            let searchInput = $('<input class="select-items-search-input" type="text" placeholder="' + param.placeholderText + '" />').appendTo(searchBox);
            let options = $('<div class="options"></options>').appendTo(selectItems);

            searchInput.on('focus change paste keyup', function () {
                var search = $(this).val();
                if (search.trim() != '') {
                    $(this).parent().siblings('.options').children().each(function () {
                        if ($(this).text().toLowerCase().indexOf(search.toLowerCase()) == -1) {
                            $(this).hide();
                        } else {
                            $(this).show();
                        }
                    })
                } else {
                    $(this).parent().siblings('.options').children().each(function () {
                        $(this).show();
                    })
                }
            });

            param.showList.forEach(function (obj) {
                let option = $('<div class="option" value="' + obj.value + '"></div>').appendTo(options);
                let label = $('<label id="label_' + $dropdown.id + '_' + obj.value + '"></label>').appendTo(option);
                $('<span class="text">' + obj.label + '</span>').appendTo(label);
                $('<span class="check"></span><input type="checkbox" />').appendTo(label);

                option.click(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $(this).find('label').toggleClass('active');
                    let selectedId = !$("#" + $dropdown.id).attr("select-id") ? [] : $("#" + $dropdown.id).attr("select-id").split(',');
                    let currentValue;
                    let option = param.source.filter(x => x[param.valueName] == $(this).attr('value'));
                    if (option.length > 0) {
                        currentValue = $(this).attr('value');
                    }

                    if ($(this).find('label').hasClass('active')) {
                        selectedId.push(currentValue);
                    } else {
                        selectedId = selectedId.filter(function (item) {
                            return item != currentValue;
                        });
                    }

                    let selectedOptionArray = param.source.filter(x => selectedId.includes(x[param.valueName].toString()));
                    let finalSelectedId = selectedOptionArray.map(x => x[param.valueName]);
                    let finalSelectedText = null;
                    if (param.inputFormat == 1) {
                        finalSelectedText = selectedOptionArray.map(x => x[param.labelName]);
                    } else if (param.inputFormat == 2) {
                        finalSelectedText = selectedOptionArray.map(x => x[param.valueName]);
                    } else if (param.inputFormat == 3) {
                        finalSelectedText = selectedOptionArray.map(x => x[param.valueName] + "-" + x[param.labelName]);
                    }

                    $("#" + $dropdown.id).val(finalSelectedText.join('、'));
                    $("#" + $dropdown.id).attr("select-id", finalSelectedId.join(','));

                    if (param.onchange) {
                        param.onchange($dropdown.id, option[0], selectedId.indexOf(currentValue) > 0);
                    }
                });
            })
            $("#" + $dropdown.id).after(selectItems);

            let $dropClear = $("#" + $dropdown.id).parent().find(".drop__clear");
            if ($dropClear.length > 0) {
                $dropClear.off("click");
                $dropClear.click(function (e) {
                    e.stopPropagation();
                    if (!$("#" + $dropdown.id).prop("disabled")) {
                        $("#" + $dropdown.id).parent().find('.select-items input[type="text"]').val('');
                        $("#" + $dropdown.id).parent().find('.select-items .options').children().each(function () {
                            $(this).children().removeClass('active');
                        })
                        $("#" + $dropdown.id).val('');
                        $("#" + $dropdown.id).attr("select-id", '');

                        if (param.onchange) {
                            param.onchange($dropdown.id, undefined, undefined);
                        }
                    }
                });
            }
        };

        $dropdown.destroy = function () {
            let selectItems = $("#" + $dropdown.id).parent().find('.select-items');
            if (selectItems.length > 0) {
                $("#" + $dropdown.id).val("");
                $("#" + $dropdown.id).attr("select-id", "");
                selectItems.remove()
            }
        };

        $dropdown.setDropdownValues = function (arr) {
            let selectedOptionArray = $dropdown.source.filter(x => arr.includes(x[$dropdown.valueName]));
            let finalSelectedId = selectedOptionArray.map(x => x[$dropdown.valueName]);
            let finalSelectedText = null;
            if ($dropdown.inputFormat == 1) {
                finalSelectedText = selectedOptionArray.map(x => x[$dropdown.labelName]);
            } else if ($dropdown.inputFormat == 2) {
                finalSelectedText = selectedOptionArray.map(x => x[$dropdown.valueName]);
            } else if ($dropdown.inputFormat == 3) {
                finalSelectedText = selectedOptionArray.map(x => x[$dropdown.valueName] + "-" + x[$dropdown.labelName]);
            }

            finalSelectedId.forEach(function (item) {
                $("#label_" + $dropdown.id + "_" + item).addClass("active");
            })

            $("#" + $dropdown.id).val(finalSelectedText.join('、'));
            $("#" + $dropdown.id).attr("select-id", finalSelectedId.join(','));
        }

        $dropdown.getSelectedArray = function () {
            if ($("#" + $dropdown.id).attr("select-id")) {
                let selectedId = $("#" + $dropdown.id).attr("select-id").split(",");
                return $dropdown.source.filter(x => selectedId.includes(x[$dropdown.valueName].toString()));
            } else {
                return [];
            }
        }

        $dropdown.init($dropdown);
        return $dropdown;
    };

})(jQuery);

$(document).on('click', '.dropdown__container-multi', function () {
    let id = $(this).find(':input:first').attr("id");
    if (!$("#" + id).prop("disabled")) {
        //是否唯讀
        $(this).addClass('active');
    }
});

$(document).on('keydown blur', '.select-items-search-input', function (e) {
    if (e.keyCode == 9) {
        if (!$(e.target).hasClass("select-selected")) {
            $('.dropdown__container-multi').removeClass('active');
        }
    }
});

$(document).on('click touchstart', function (e) {
    if ($('.dropdown__container-multi') !== e.target && !$('.dropdown__container-multi').has(e.target).length) {
        $('.dropdown__container-multi').removeClass('active');
    }
});