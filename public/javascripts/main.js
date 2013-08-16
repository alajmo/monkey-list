function appendTodo1(content, lid) {
    var entry = "<div class='todo-wrapper ui-state-default'>" +
            "<textarea class='entryText' name='content' accept-charset='utf-8'>" + content + "</textarea>" +
            "<textarea class='commentText' name='comment' accept-charset='utf-8'></textarea>" +
            "<input type='text' class='deadlineText widget' name='deadline' accept-charset='utf-8'></input>" +
            "<div class='deadlineHelper'></div> " +
            "<div class='tool-box'>" +
            "<div class='statusBtn'></div>" +
            "<div class='commentBtn'></div>" +
            "<div class='deadlineBtn'></div>" +
            "<div class='deleteBtn'></div>" +
            "</div>" +
            "</div>";
    $(entry).appendTo('.todoList');
    setupTodo();
    $("#new-form")[0].reset();
    return false;
}
;
//     var entry = "<div id='' class='todo-wrapper ui-state-default'>" +
function appendTodo2(lid, tid, order, content) {
    var entry = "<div id=\"" + order + "\" class=\"todo-wrapper " + tid + "\">" +
            "<textarea onchange='updateTodo(\"" + lid + "\", \"" + tid + "\", value, name)' class='entryText' name='content' accept-charset='utf-8'>" + content + "</textarea>" +
            "<textarea onchange='updateTodo(\"" + lid + "\", \"" + tid + "\", value, name)' class='commentText' name='comment' accept-charset='utf-8'></textarea>" +
            "<input type='text' onchange='updateTodo(" + lid + "," + tid + ", value, name)' class='deadlineText widget' name='deadline' accept-charset='utf-8'></input>" +
            "<div class='deadlineHelper'></div> " +
            "<div class='tool-box'>" +
            "<div class='statusBtn'></div>" +
            "<div class='commentBtn'></div>" +
            "<div class='deadlineBtn'></div>" +
            "<div class='deleteBtn'></div>" +
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
    if ($.cookie("showComments") === "no") {
        $('.commentText').hide();
    }
    if ($.cookie("showDeadlines") === "no") {
        $('.deadlineText').hide();
        $('.deadlineHelper').hide();
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
            alert('text status ' + textstatus + ', err ' + errorThrown);
        }
    });

}
;

function updateOrder(lid, tids, old_position, new_position) {
    $.ajax({
        type: "POST",
        url: '/sort/',
        data: {
            lid: lid,
            tids: tids,
            old_position: old_position,
            new_position: new_position
        },
        success: function() {
        },
        error: function(jqXHR, textstatus, errorThrown) {
            alert('text status ' + textstatus + ', err ' + errorThrown);
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
            alert('text status ' + textstatus + ', err ' + errorThrown);
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
            //$('#' + tid).toggleClass('todoFinished');
        },
        error: function(jqXHR, textstatus, errorThrown) {
            alert('text status ' + textstatus + ', err ' + errorThrown);
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
            alert('text status ' + textstatus + ', err ' + errorThrown);
        }
    });

}
;

function showComments() {
    if ($.cookie("showComments") === "yes") {
        $('.commentText').hide();
        $.cookie("showComments", "no");
    }
    else {
        $('.commentText').show();
        $.cookie("showComments", "yes");
    }
}
;

function showDeadlines() {
    if ($.cookie("showDeadlines") === "yes") {
        $('.deadlineText').hide();
        $('.deadlineHelper').hide();
        $.cookie("showDeadlines", "no");
    }
    else {
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