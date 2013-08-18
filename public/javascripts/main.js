function appendTodo1(content, lid) {
    var entry = "<div class='todo-wrapper ui-state-default'>" +
            "<textarea class='entryText' name='content' accept-charset='utf-8'>" + content + "</textarea>" +
            "<textarea class='commentText' name='comment' accept-charset='utf-8'></textarea>" +
            "<input type='text' class='deadlineText widget' name='deadline' accept-charset='utf-8'></input>" +
            "<div class='deadlineHelper'></div> " +
            "<div class='tool-box'>" +
            "<div class='statusBtn'>&#9744;</div>" +
            "<div class='commentBtn'>N</div>" +
            "<div class='deadlineBtn'>T</div>" +
            "<div class='deleteBtn'>&#10006;</div>" +
            "</div>" +
            "</div>";
    $(entry).appendTo('.todoList');
    setupTodo();
    $("#new-form")[0].reset();
    return false;
}
;
function appendTodo2(lid, tid, order, content) {
    var entry = "<div id=\"" + order + "\" class=\"todo-wrapper " + tid + "\">" +
            "<textarea onchange='updateTodo(\"" + lid + "\", \"" + tid + "\", value, name)' class='entryText' name='content' accept-charset='utf-8'>" + content + "</textarea>" +
            "<textarea onchange='updateTodo(\"" + lid + "\", \"" + tid + "\", value, name)' class='commentText' name='comment' accept-charset='utf-8'></textarea>" +
            "<input type='text' onchange='updateTodo(" + lid + "," + tid + ", value, name)' class='deadlineText widget' name='deadline' accept-charset='utf-8'></input>" +
            "<div class='deadlineHelper'></div> " +
            "<div class='tool-box'>" +
            "<div class='statusBtn'>&#9744;</div>" +
            "<div class='commentBtn'>N</div>" +
            "<div class='deadlineBtn'>T</div>" +
            "<div class='deleteBtn'>&#10006;</div>" +
            "</div>" +
            "</div>";
    $(entry).appendTo('.todoList');
    setupTodo();
    $("#new-form")[0].reset();

    return false;
}
;

/*
 * Adjust textarea to expand as person writes
 */
function scrollable() {
    $('.todo-wrapper').delegate('textarea', 'keyup', function() {
        $(this).height(0);
        $(this).height(this.scrollHeight);
    });
    $('.todo-wrapper').find('textarea').keyup();
}
;

function setupTodo() {
    // Remember comments and deadline status
    if ($.cookie("showComments") === "no") {
        $('.commentText').hide();
        $('#notesBtn').css("color", "#9abb94");
    }

    if ($.cookie("showDeadlines") === "no") {
        $('.deadlineText').hide();
        $('.deadlineHelper').hide();
        $('#timeBtn').css("color", "#9abb94");
    }

    $(".deadlineText").datetimepicker({showAnim: "fadeIn"});

    $(".todo-wrapper").off().on({mouseover: function(event) {
            if ($(event.target).attr("class") != "deadlineHelper") {
                $(this).find('.tool-box').show();
            }
        }, mouseout: function() {
            $(this).find('.tool-box').hide();
        }});
    $(".statusBtn").off("click").on("click", function() {
        $(this).closest('.todo-wrapper').find('.entryText').toggleClass('todoFinished');
        if ($(this).html() == decodeEntities("&#9744;")) {
            $(this).html("&#9745;");
        }
        else {
            $(this).html("&#9744;");
        }
    });
    $(".commentBtn").off("click").on("click", function() {
        $(this).closest('.todo-wrapper').find('.commentText').toggle();
    });
    $(".deadlineBtn").off("click").on("click", function() {
        $(this).closest('.todo-wrapper').find('.deadlineText').toggle();
        $(this).closest('.todo-wrapper').find('.deadlineHelper').toggle();
    });
    $('.deleteBtn').off("click").on("click", function() {
        $(this).closest(".todo-wrapper").remove();
    });
    scrollable();

}
;

function createTodo(lid, tid, order, content) {
    $.ajax({
        type: "POST",
        url: '/create/',
        data: {lid: lid,
            tid: tid,
            order: order,
            content: content
        },
        success: function() {
            appendTodo2(lid, tid, order, content);
        },
        error: function(jqXHR, textstatus, errorThrown) {
            //alert('text status ' + textstatus + ', err ' + errorThrown);
        }
    });

}
;

function updateOrder(lid, tids, new_position) {
    $.ajax({
        type: "POST",
        url: '/sort/',
        data: {
            lid: lid,
            tids: tids,
            new_position: new_position
        },
        success: function() {
        },
        error: function(jqXHR, textstatus, errorThrown) {
           //alert('text status ' + textstatus + ', err ' + errorThrown);
        }
    });
}

function updateTodo(lid, tid, value, typeUpdate) {
    $.ajax({
        type: "POST",
        url: '/update/',
        data: {
            lid: lid,
            tid: tid,
            typeUpdate: typeUpdate,
            value: value
        },
        success: function(data) {
        },
        error: function(jqXHR, textstatus, errorThrown) {
            //alert('text status ' + textstatus + ', err ' + errorThrown);
        }
    });
}
;

function updateStatus(lid, tid, status) {
    $.ajax({
        type: "POST",
        url: '/status/',
        data: {
            lid: lid,
            tid: tid,
            status: status
        },
        success: function() {
        },
        error: function(jqXHR, textstatus, errorThrown) {
            //alert('text status ' + textstatus + ', err ' + errorThrown);
        }
    });

}
;

function deleteTodo(lid, tid) {
    $.ajax({
        type: "POST",
        url: '/destroy/',
        data: {lid: lid,
            tid: tid
        },
        success: function(lid) {
            $('.' + tid).parent().remove();
        },
        error: function(jqXHR, textstatus, errorThrown) {
            //alert('text status ' + textstatus + ', err ' + errorThrown);
        }
    });

}
;

function showComments() {
    if ($.cookie("showComments") === "yes") {
        $('#notesBtn').css("color", "#9abb94");
        $('.commentText').hide();
        $.cookie("showComments", "no");
    }
    else {
        $('#notesBtn').css("color", "#a1df95");
        $('.commentText').show();
        $.cookie("showComments", "yes");
    }
}
;

function showDeadlines() {
    if ($.cookie("showDeadlines") === "yes") {
        $('#timeBtn').css("color", "#9abb94");
        $('.deadlineText').hide();
        $('.deadlineHelper').hide();
        $.cookie("showDeadlines", "no");
    }
    else {
        $('#timeBtn').css("color", "#a1df95");
        $('.deadlineText').show();
        $('.deadlineHelper').show();
        $.cookie("showDeadlines", "yes");
    }
}
;


$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};



var decodeEntities = (function() {
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');
    function decodeHTMLEntities(str) {
        if (str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }
        return str;
    }
    return decodeHTMLEntities;
})();