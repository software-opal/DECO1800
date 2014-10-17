// Generated by CoffeeScript 1.7.1
var make_year, months;

window.database = {};
window.timeline_db = [];


MONTH_NAMES = {
    1: "January",
    2: "Febuary",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
};

$.extend(Trove.defaults, {
    q: "(" + town + ") -title:(Advertising)",
    include: "articletext,links,years",
    zone: "newspaper,picture"
});
Trove.page_size = 50;

$(window).ready(function () {
    $(document).ajaxStart(function () {
        $("#loading-spinner").removeClass("hidden");
    });
    $(document).ajaxStop(function () {
        $("#loading-spinner").addClass("hidden");
    });
});
