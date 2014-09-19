// Generated by CoffeeScript 1.7.1
var make_year, months;

window.database = {};
window.timeline_db = [];


MONTH_NAMES = {
    1: ["Jan", "January"],
    2: ["Jan", "Febuary"],
    3: ["Jan", "March"],
    4: ["Jan", "April"],
    5: ["Jan", "May"],
    6: ["Jan", "June"],
    7: ["Jan", "July"],
    8: ["Jan", "August"],
    9: ["Jan", "September"],
    10: ["Jan", "October"],
    11: ["Jan", "November"],
    12: ["Jan", "December"]
};

$.extend(Trove.defaults, {
    q: town,
    include: "articletext,links,years",
    zone: "newspaper"
});


function make_year(year, months) {
    function make_year_element(year) {
        var yr_elm = $("<div></div>");
        yr_elm.attr("id", "y" + year);
        timeline_db[year] = {
            element: yr_elm,
            months: []
        };
        return yr_elm;
    }
    function make_month_element(year, month) {
        e = $("<div></div>");
        e.append($("<div class='month-heading'>" + MONTH_NAMES[month][1] + " " + year + "</div>"));
        e.append($("<div class='content'><div class='left-content'></div><div class='right-content'></div></div>"));
        e.attr("id", "y" + year + "m" + month);
        timeline_db[year].months[month] = e;
        return e;
    }

    if (!months || months.length === 0) {
        months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }
    var year = parseInt(year);
    var timeline = $("#timeline");
    if (timeline_db.length <= year) {
        // We don't have any years after this one.
        var yr_elm = make_year_element(year);
        timeline.append(yr_elm);
    } else if (timeline_db[year] === undefined) {
        for (var i = year + 1; i < timeline_db.length; i++) {
            if (timeline_db[i] !== undefined) {
                // Found a year that is after the current one.
                var yr_elm = make_year_element(year);
                timeline_db[i].element.before(yr_elm);
                break;
            }
        }
    }
    // The year now exists and has stuff ready.

    var yr_data = timeline_db[year];
    var elm = yr_data.element;
    for (i = 0; i < months.length; i++) {
        var month = months[i];
        if (yr_data.months.length <= month) {
            // We don't have any years after this one.
            var m_elm = make_month_element(year, month);
            elm.append(m_elm);
        } else if (yr_data.months[month] === undefined) {
            for (var i = month + 1; i < yr_data.months.length; i++) {
                if (yr_data.months[i] !== undefined) {
                    // Found a year that is after the current one.
                    var m_elm = make_month_element(year, month);
                    yr_data.months[i].before(m_elm);
                    break;
                }
            }
        }
    }
}


function get_month_for(year, month) {
    ymid = "#y" + year + "m" + month;
    if ($("#timeline").find(ymid).length === 0) {
        make_year(year, [month]);
    }
    return $("#timeline").find(ymid).find(".content");
}


function parse_date(date_string) {
    // DAte: yyyy-mm-dd
    date_split = date_string.split("-");
    switch (date_split.length) {
        case 1:
            return {y: parseInt(date_split[0]), m: -1, d: -1};
        case 2:
            return {y: parseInt(date_split[0]), m: parseInt(date_split[1]), d: -1};
        default:
            return {y: parseInt(date_split[0]), m: parseInt(date_split[1]), d: parseInt(date_split[2])};
    }
}

function height_of_children(node) {
    var h = 0;
    var c = node.children();
    for (var i = 0; i < c.length; i++) {
        h += $(c[i]).height();
    }
    return h;
}


function get_trove_listing(start, end, page_no) {
    var htmlTag = /<\/?(p|span)>/ig;
    if (!page_no) {
        page_no = 0;
    }
    Trove.date_listing(start, end, page_no, function (jqxhr, status) {
        if (status !== "success") {
            console.log(jqxhr.responseJSON);
            return get_trove_listing(start, end, page_no);
        }
        var data = jqxhr.responseJSON.response.zone[0].records.article;
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var date = parse_date(d.date);
            var content = get_month_for(date.y, date.m);
            
            var left = content.find(".left-content");
            var right = content.find(".right-content");
            
            var ll = height_of_children(left);
            var rl = height_of_children(right);

            var c = $("<div class='trove-content trove-newpapaer'><div class='trove-content-row'><div class='heading-wrapper'><div class='heading'></div></div><div class='date'></div></div><div class='trove-content-row'><div class='body'></div></div></div>");
            
            var text = d.articleText.replace(htmlTag, "");
            
            c.attr("id", d.id);
            
            c.find('.body').text(text);
            c.find('.heading').text(d.heading);
            c.find('.date').text(d.date);
            
            database[d.id] = d;

            if(rl < ll) {
                right.append(c);
            } else {
                left.append(c);              
            }
        }
    });
}


$(function () {
    get_trove_listing(1950, false, 0);
    get_trove_listing(false, 1950, 0);
});
