if (!$.cookie("showComments")) {
    $.cookie("showComments", "yes", {path: '/', expires: 1000});
}

if (!$.cookie("showDeadlines")) {
    $.cookie("showDeadlines", "yes", {path: '/', expires: 1000});
}