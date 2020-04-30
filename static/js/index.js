$(document).ready(function() {

    filterType = [];
    filterTime = null;
    filterMonth = null;
    filterSubtype = [];
    filterQuery = null;
    sortDir = 'desc';
    sortMethod = null;
    page = 0;
    loadMore = false;

    $(".js-more").click(function() {
        page += 1; 
        loadMore = true;
        populatePage();
    });
    $(".js-insect").click(typeChange);
    $(".js-fossil").click(typeChange);
    $(".js-fish").click(typeChange);
    $(".js-clothing").click(typeChange);
    $(".js-consumable").click(typeChange);
    $(".js-mineral").click(typeChange);
    $(".js-music").click(typeChange);
    $(".js-decor").click(typeChange);
    $(".js-handheld").click(typeChange);
    $(".js-currency").click(typeChange);
    $(".js-award").click(typeChange);
    $(".js-forage").click(typeChange);

    $(".js-time").keyup(timeChange);
    $(".js-month").keyup(timeMonth);
    $(".js-searchbar").keyup(queryChange);

    $(".js-cost").click(sortToggle);
    $(".js-sell").click(sortToggle);
    $(".js-name").click(sortToggle);

    populatePage();

    function expandRow() {
        console.log("it worked");
        //this will open up the row to show additional information
    }

    function typeChange() {
        newFilter = $(this).text();
        if (filterType.includes(newFilter)) {
            filterType = filterType.filter(f => f != newFilter);
            $(this).fadeTo(.5, .5);
        } else {
            filterType.push(newFilter);
            $(this).fadeTo(.5, 1);
        }
        page = 0;
        populatePage();
    }

    function queryChange() {
        filterQuery = $(this).val();
        page = 0;
        populatePage();
    }

    function timeChange() {
        filterTime = $(this).val();
        page = 0;
        populatePage();
    }

    function timeMonth() {
        filterMonth = $(this).val();
        page = 0;
        populatePage();
    }

    function sortToggle() {
        sortMethod = $(this).text();
        if (sortDir == 'asc') {
            sortDir = 'desc';
        } else {
            sortDir = 'asc';
        }
        page = 0;
        populatePage();
    }

    function populatePage() {

        $.ajax({
            method: "GET",
            url: "/api/items",
            data: {
                "type": filterType,
                "time": filterTime,
                "subtype": filterSubtype,
                "sort": sortMethod,
                "month": filterMonth,
                "dir": sortDir,
                "search": filterQuery,
                "page": page
            },
            success: function(data) {
                if (data.length < 50) {
                    $(".js-more").css("display","none");
                } else {
                    $(".js-more").css("display","inline-block");
                }
                const targetLocation = $("#js-items");
                if (loadMore == false) {
                    targetLocation.empty();
                }
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    //don't forget to add in images for currency
                    var itemrow = `
                        <tr id="${item['id']}">
                            <td>${item['type']}</td>
                            <td>${item['subtype']}</td>
                            <td>${item['name']}</td>
                            <td>${item['time_start']} - ${item['time_end']}</td>
                            <td>${item['months_available']}</td>
                            <td><span class="costmobile">COST</span>${item['cost']}</td>
                            <td><span class="sellmobile">SELL</span>${item['sell_price']}</td>
                        </tr>`;
                    targetLocation.append(itemrow);
                    $(`#${item['id']}`).click(expandRow);
                    loadMore = false;
                }
            }
        });
    }



})