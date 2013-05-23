var tabid;

chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, {mtype: 'getFormInfo'}, function(response) {
        tabid = tab.id;
        console.log('got response', response);

        var domain = response.domain;
        console.log('setting domain', domain);
        $('#domain').val(domain);
    });
});

function generatePassword(cb) {
    var opts = {
        presets: {
            passphrase: $('#password').val(),
            host: $('#domain').val(),
            email: $('#email').val()
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

    var engine = new Engine(opts);
    console.log(engine);
    engine.run();
}

function submit(evt) {
    evt.preventDefault();

    generatePassword(function(password) {
        chrome.tabs.sendMessage(tabid, {mtype: 'insertPasswords', password: password}, function() {
            console.log('received reply');
            window.close();
        });
    });
}

var $email = $('#email');

chrome.storage.sync.get('email', function(item) {
    if(item.email) {
        $email.val(item.email);
        setTimeout(function() {
            $('#password').focus();
        }, 0);
    };
});


$email.change(function() {
    // remove whitespace which could confuse someone
    $email.val($email.replace(/^\s+|\s+$/g, ''));

    chrome.storage.sync.set({'email': $email.val()});
    return false;
});

$('#passForm').submit(submit);
