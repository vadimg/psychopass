function generatePassword($scope, cb) {
  var opts = {
    presets: {
      passphrase: $scope.master_password,
      host: $scope.domain,
      email: $scope.email
    },
    hooks: {
      on_compute_step: function(keymode, step, ts) {
        console.log(keymode, step, ts);
        //var $progress = $('#progress');
        //$progress.width($('#password').width() * step/ts);
      },
      on_timeout: function() {},
      on_compute_done: function(keymode, key) {
        cb(key);
      },
    },
  };

  var engine = new Engine(opts);
  engine.run();
}

function MainCtrl($scope, $http, $location) {
  // get domain and tab id
  chrome.tabs.getSelected(null, function(tab) {
    $scope.tabid = tab.id;

    chrome.tabs.sendMessage(tab.id, {mtype: 'getFormInfo'},
      function(response) {
        console.log('got response', response);
        if(!response || !response.domain) {
          $location.path('/notfound');
          $scope.$apply();
          return;
        }

        var domain = response.domain;
        console.log('setting domain', domain);
        $scope.domain = domain;
        $scope.$apply();
      });
  });

  // get email
  chrome.storage.sync.get('email', function(item) {
    if(!item.email) {
      $location.path('/register');
      $scope.$apply();
      return;
    }
    $scope.email = item.email;
    $scope.$apply();
  });

  // TODO: maybe a race condition if this is called before
  // above blocks return
  $scope.submit = function() {
    generatePassword($scope, function(password) {
      chrome.tabs.sendMessage($scope.tabid,
        {mtype: 'setPassword', password: password},
        function() {
          window.close();
        });
    });
  }
}

function RegisterCtrl($scope, $http, $location) {
  $scope.email = ''
  $scope.submit = function() {
    $scope.email = $scope.email.replace(/^\s+|\s+$/g, '');
    chrome.storage.sync.set({'email': $scope.email});
    $location.path('/');
  };
}
