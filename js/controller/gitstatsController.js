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
        var i = 0;
        for (x in $scope.members){
          $http.get($scope.usersUrl + $scope.members[x].login + "/repos" + $scope.authKey)
            .success(function(data){
              $scope.repos = data;
              $scope.members[i].repoNum = $scope.repos.length;
              ++i;
              $scope.members[i].ghname = $scope.repos.name
              for (y in $scope.repos){
                // var total = 0;
                $http.get("https://api.github.com/repos/" + $scope.members[x].login +"/" + $scope.repos[y].name + "/commits") 
                var total = 0;
                $http.get($scope.reposUrl + $scope.members[x].login +"/" + $scope.repos[y].name + "/commits" + $scope.authKey) 
                  .success(function(data){
                    // total += data.length;
                    console.log(data.length);
                  })
                  .error(function( ){
                    // total += 0;
                  })
              }
              // console.log(total);
            })
        }
      })
      .error(function( ){
        $scope.orgNotFound = true;
      })
  }
})