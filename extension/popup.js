var tabid;

chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, {mtype: 'getFormInfo'}, function(response) {
        console.log('got response', response);
        if(!response) {
            return;
        }

        tabid = tab.id;

        var domain = response.domain;
        console.log('setting domain', domain);
        $('#domain').text(domain);
    });
});

function generatePassword(cb) {
    var opts = {
        presets: {
            passphrase: $('#password').val(),
            host: $('#domain').text(),
            email: $('#email').text()
        },
        hooks: {
            on_compute_step: function(keymode, step, ts) {
                console.log(keymode, step, ts);
            },
            on_timeout: function() {},
            on_compute_done: function(keymode, key) {
                cb(key);
            },
        },
    };

    /*
    $('#password').insertAfter('<div id="progress"></div>');
    var $progress = $('#progress');
    $progress.top($('#password').top());
    $progress.left($('#password').left());
    $progress.width($('#password').width());
    $progress.height($('#password').height());
    */

    var engine = new Engine(opts);
    engine.run();
}

function submit(evt) {
    evt.preventDefault();

    generatePassword(function(password) {
        chrome.tabs.sendMessage(tabid, {mtype: 'insertPasswords', password: password}, function() {
            window.close();
        });
    });
}

var $email = $('#email');

chrome.storage.sync.get('email', function(item) {
    if(item.email) {
        $email.text(item.email);
        $('#password').focus();
    };
});


/*
$email.change(function() {
    // remove whitespace which could confuse someone
    $email.val($email.replace(/^\s+|\s+$/g, ''));

    chrome.storage.sync.set({'email': $email.val()});
    return false;
});
*/

$('#passForm').submit(submit);
