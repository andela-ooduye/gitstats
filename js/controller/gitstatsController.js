var app = angular.module("gitHub", []);
app.controller("GitCtrl", function($scope, $http, $q){
  $scope.getGitInfo = function () {
    $scope.orgNotFound = false;
    $scope.loaded = false;

    $scope.authKey = "?client_id=92e95931025ef214002d&client_secret=a4c5fb9e89d0f073f65394933f4871a541c00818";
    $scope.orgUrl = "https://api.github.com/orgs/";
    $scope.usersUrl = "https://api.github.com/users/";
    $scope.reposUrl = "https://api.github.com/repos/";
    $scope.members = [];
    $scope.companyName;

    var i = 0;
    $scope.members = [];
    var userDataCall;
    var repoDataCall;
    
    $http.get($scope.orgUrl + $scope.orgname + "/members" + $scope.authKey)
      .success(function(data){
        $scope.companyName = $scope.orgname;

        angular.forEach(data, function(userData) {         

          userDataCall = $http.get($scope.usersUrl + userData.login + $scope.authKey);
          
          repoDataCall = $http.get($scope.usersUrl + userData.login + "/repos" + $scope.authKey);
          
          $q.all([userDataCall, repoDataCall]).then(function(data){
            $scope.members.push({login: userData.login, fullName: data[0].data.name, repoNum: data[0].data.public_repos, userGitUrl: data[0].data.html_url, repoNum2: data[1].data.length});            
          });
              
      });      
      $scope.loaded = true;             
  });
}

});