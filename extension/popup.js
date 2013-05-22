function submit(evt) {
    evt.preventDefault();

    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {mtype: 'getFormInfo'}, function(response) {
            console.log('got response', response);

            var domain = response.domain;
            var password = domain + 'pass';

            chrome.tabs.sendMessage(tab.id, {mtype: 'insertPasswords', password: password}, function() {
                console.log('received reply');
                window.close();
            });
        });
    });
}

$('#passForm').submit(submit);
