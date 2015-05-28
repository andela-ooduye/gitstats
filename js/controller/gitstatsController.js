var app = angular.module("gitHub", []);
app.controller("GitCtrl", function($scope, $http){
  $scope.getGitInfo = function () {
    $scope.orgNotFound = false;
    $scope.loaded = false;

    $scope.authKey = "?client_id=92e95931025ef214002d&client_secret=a4c5fb9e89d0f073f65394933f4871a541c00818";
    $scope.orgUrl = "https://api.github.com/orgs/";
    $scope.usersUrl = "https://api.github.com/users/";
    $scope.reposUrl = "https://api.github.com/repos/";
    
    $http.get($scope.orgUrl + $scope.orgname + "/members" + $scope.authKey)
      .success(function(data){
        $scope.members = data;
        $scope.loaded = true;
        $scope.members.org = $scope.orgname;
        var i = 0;

        for (x in $scope.members){
          $http.get($scope.usersUrl + $scope.members[x].login + $scope.authKey)
            .success(function(data){
              $scope.users = data;
              if ($scope.members[i]){
                $scope.members[i].userName = $scope.users.name;
                $scope.members[i].repoNum = $scope.users.public_repos;
                $scope.members[i].followers = $scope.users.followers;
                $scope.members[i].following = $scope.users.following;
                ++i
              }
            })
            .error(function(){

            })
        }
      })
      .error(function(){
        $scope.orgNotFound = true;
      })
  }
})