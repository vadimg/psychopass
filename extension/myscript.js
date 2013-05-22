var $lastFocused;

// set up tracking of last focused password box
$(document).on('click', 'input[type=password]', function(e) {
    var $passBox = $(e.target);
    console.log(e.target);
    $lastFocused = $passBox;
});

function getPassField() {
    var $passBoxes = $("input[type=password]").filter(':visible');
    var len = $passBoxes.length;
    console.log('number of passboxes', len);
    if(len === 1) {
        return $passBoxes.first();
    } else {
        return $lastFocused;
    }
}

function extractActionDomain(action) {
    var matches = action.match(/^(https?:)?\/\/(.+?)(\/|$)/);
    if(!matches || matches.length < 3) {
        return;
    }

    var domain = matches[2];
    if(!domain) {
        return;
    }

    var parts = domain.split('.');
    if(parts.length < 2) {
        return;
    }

    return parts[parts.length - 2] + '.' + parts[parts.length - 1];
}

function extractLocationDomain() {
    var matches = location.host.match(/\.?([^.]*?\.?[^.]*?)(:|$)/);
    return matches[1];
}

function getDomain($form) {
    var action = $form.attr('action');

    // try to get domain from action
    var actionDomain = extractActionDomain(action);
    if(actionDomain) {
        //return actionDomain;
    }

    // try to get domain from location
    return extractLocationDomain();
}

function getFormInfo(request, cb) {
    var $passBox = getPassField();
    if(!$passBox) {
        return;
    }

    var $form = $passBox.parents('form');
    var domain = getDomain($form);
    console.log('domain', domain);

    console.log('sending response');
    cb({domain: domain});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('message', request.mtype, sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    var FUNC_MAP = {
        getFormInfo: getFormInfo,
        insertPasswords: function(request, cb) {
            var $passField = getPassField();
            if(!$passField) {
                return;
            }

            console.log('password!', request.password);

            $passField.val(request.password);
            $passField.focus();
            cb();
        },
    };

    var f = FUNC_MAP[request.mtype];
    if(f) {
        f(request, sendResponse);
    }
});
