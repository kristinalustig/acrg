$(document).ready(function() {

    $(".js-submit").click(function(event) {
        event.preventDefault();

        itemMonths = [];
        $("input:checkbox").each(function() {
            if ($(this).prop("checked") == true) {
                itemMonths.push($(this).next().text());
            }
        });

        itemForm = {
            "name": $("#item-name").val(),
            "type": $("#item-type").val(),
            "subtype": $("#item-subtype").val(),
            "notes": $("#item-notes").val(),
            "sell_price": $("#item-sell").val(),
            "cost": $("#item-cost").val(),
            "time_start": $("#item-time-start").val(),
            "time_end": $("#item-time-end").val(),
            "months_available": itemMonths
        };

        //should add in basic client-side validation here? only re: the format.

        console.log(itemForm);

        $.ajax({
            method: "POST",
            url: "/api/items",
            data: JSON.stringify(itemForm),
            contentType: "application/json",
            success: function(data) {
                window.location.href="/success";
            }
        });

    });

})