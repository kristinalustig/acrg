$(document).ready(function() {

    //jQuery.ajaxSettings.traditional = true;

    $.ajax({
        method: "GET",
        url: '/api/items',
        data: {
            "type": ["Fish","Decor"],
            //"time": 10,
            //"search": "",
            //"month": 3,
            "sort": "name",
            "sort_direction": "desc",
            "page": "1"
        },
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                //don't forget to add in images for currency
                var itemrow = `
                    <tr>
                        <td>${item['type']}</td>
                        <td>${item['subtype']}</td>
                        <td>${item['name']}</td>
                        <td>${item['time_start']} - ${item['time_end']}</td>
                        <td>${item['months_available']}</td>
                        <td><span class="costmobile">COST</span>${item['cost']}</td>
                        <td><span class="sellmobile">SELL</span>${item['sell_price']}</td>
                    </tr>`;
                $(".js-items").append(itemrow);
                
            }
        }
    });

})