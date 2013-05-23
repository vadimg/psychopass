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

function submit(evt) {
    evt.preventDefault();

    var domain = $('#domain').val();
    var password = domain + 'pass';

    chrome.tabs.sendMessage(tabid, {mtype: 'insertPasswords', password: password}, function() {
        console.log('received reply');
        window.close();
    });
}

$('#passForm').submit(submit);
