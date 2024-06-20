(function ($) {
    'use strict';
    $.fn.dynamicMultiDropdown = function (param) {
        let defaultSetting = {

        };
        let $dropdown = $.extend(defaultSetting, param);
        let $selectItems;
        let $options;

        $dropdown.id = $(this).attr('id');

        $dropdown.init = function (param) {
            $dropdown.destroy();

            $("#" + $dropdown.id).focus(function () {
                if ($(this).prop("disabled")) {
                    $(this).blur();
                } else {
                    $(this).parent().addClass('active');
                }
            });

            $("#" + $dropdown.id).keypress(function (e) {
                // console.log("keyPress");
                if (e.key === 'Enter' || e.keyCode === 13) {
                    //console.log("Enter Press");
                    genOption($("#" + $dropdown.id).val());
                    $("#" + $dropdown.id).val("");
                }
            });

            $("#" + $dropdown.id).parent().on('click', '.cancel', function () {
                console.log("cancel");
                $(this).parent().parent().remove();
            });

            $selectItems = $('<div class="select-items"></div>');
            $options = $('<div class="options"></options>').appendTo($selectItems);
            $("#" + $dropdown.id).after($selectItems);

            let $dropAdd = $("#" + $dropdown.id).parent().find(".drop__add");
            if ($dropAdd.length > 0) {
                $dropAdd.off("click");
                $dropAdd.click(function (e) {
                    e.stopPropagation();
                    if (!$("#" + $dropdown.id).prop("disabled")) {

                        genOption($("#" + $dropdown.id).val());
                        $("#" + $dropdown.id).val("");

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

        $dropdown.clear = function () {
            $options.empty();
        }

        $dropdown.init($dropdown);

        $dropdown.getArray = function () {

            let arr = [];
            let options = $options.find(".option");
            $(options).each(function (index, element) {
                console.log(index + ": " + $(this).text());
                arr.push($(this).attr("value"));
            });

            return arr;

        }


        function genOption(val) {
            // console.log("genOption");
            // console.log(val);

            if (!val || !val.trim()) {
                return;
            }

            let option = $('<div class="option" value="' + val + '"></div>').appendTo($options);
            let label = $('<label id="label_' + $dropdown.id + '_' + val + '"></label>').appendTo(option);
            $('<span class="text">' + val + '</span>').appendTo(label);
            $('<span class="cancel">').appendTo(label);
        }

        return $dropdown;
    };


})(jQuery);

// $(document).on('click', '.dynamic_dropdown__container-multi', function () {
//     let id = $(this).find(':input:first').attr("id");
//     if (!$("#" + id).prop("disabled")) {
//         //是否唯讀
//         $(this).addClass('active');
//     }
// });

// $(document).on('blur', '.dynamic_dropdown__container-multi', function (e) {
//     if (!$(e.target).hasClass("select-selected")) {
//         $('.dynamic_dropdown__container-multi').removeClass('active');
//     }
// });

// $(document).on('click touchstart', function (e) {
//     if ($('.dynamic_dropdown__container-multi') !== e.target && !$('.dynamic_dropdown__container-multi').has(e.target).length) {
//         $('.dynamic_dropdown__container-multi').removeClass('active');
//     }
// });