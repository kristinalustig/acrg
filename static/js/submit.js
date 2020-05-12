$(document).ready(function() {

    $(".js-submit").click(function(event) {
        event.preventDefault();

        $(".errors").hide();
        var hasMonths = false;
        var errorOut = false;
        var errorMessages = "";
        var isRecipe = false;
        var isCraftable = false;
        var itemMonths = [];
        var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];


        if ($("#item-is-recipe").prop('checked')) {
            isRecipe = true;
        }

        if ($("#item-has-recipe").prop('checked')) {
            isCraftable = true;
        }

        $("input:checkbox").each(function() {
            var nextMonth = $(this).next().text();
            if (months.indexOf(nextMonth) >= 0) {
                if ($(this).prop("checked") == true) {
                    itemMonths.unshift(1);
                    hasMonths = true;
                } else {
                    itemMonths.unshift(0);
                }
            }
        });
        itemMonths.join("");
        itemMonths = parseInt(itemMonths.join(""),2);

        if (hasMonths != true) {
            errorOut = true;
            errorMessages += "<div class='individual-error'>Please select one or more months that this item is available.</div>";
        }
        if ($("#item-name").val().length == 0) {
            errorOut = true;
            errorMessages += "<div class='individual-error'>Your item must have a name.</div>";
        }

        if ($("#item-type").val().length == 0) {
            errorOut = true;
            errorMessages += "<div class='individual-error'>Please select a type for your item. If unsure, make your best guess.</div>";
        }

        if ($("#item-subtype").val().length == 0) {
            errorOut = true;
            errorMessages += "<div class='individual-error'>Please select a subtype for your item. If unsure, make your best guess.</div>";
        }

        if ($("#item-time-start").val().length == 0) {
            errorOut = true;
            errorMessages += "<div class='individual-error'>Please enter a start time. If your item is available all day, enter 0 to 24.</div>";
        }

        if ($("#item-time-end").val().length == 0) {
            errorOut = true;
            errorMessages += "<div class='individual-error'>Please enter an end time. If your item is available all day, enter 0 to 24.</div>";
        }

        if (errorOut == true) {
            $(".errors").show();
            $(".errors").append(errorMessages);
        } else {
            itemForm = {
                "name": $("#item-name").val(),
                "type": $("#item-type").val(),
                "subtype": $("#item-subtype").val(),
                "notes": $("#item-notes").val(),
                "sell_price": $("#item-sell").val(),
                "cost": $("#item-cost").val(),
                "cost_currency": $("#item-cost-currency").val(),
                "time_start": $("#item-time-start").val(),
                "time_end": $("#item-time-end").val(),
                "months_available": itemMonths,
                "is_recipe": isRecipe,
                "has_recipe": isCraftable
            };

            $.ajax({
                method: "POST",
                url: "/api/items",
                data: JSON.stringify(itemForm),
                contentType: "application/json",
                success: function(data) {
                    window.location.href="/success";
                },
                error: function(data) {
                    $(".errors").show();
                    $(".errors").append(`<div class='individual-error'>Error: ${data['message']}</div>`);
                } 
            });
        }
    });

})