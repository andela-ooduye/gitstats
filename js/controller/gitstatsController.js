var app = angular.module("gitHub", []);
app.controller("GitCtrl", function($scope, $http){
  $scope.getGitInfo = function () {
    $scope.orgNotFound = false;
    $scope.loaded = false;

    $http.get("https://api.github.com/orgs/" + $scope.orgname + "/members")
      .success(function(data){
        $scope.members = data;
        $scope.loaded = true;
        var i = 0;
        for (x in $scope.members){
          $http.get("https://api.github.com/users/" + $scope.members[x].login + "/repos")
            .success(function(data){
              $scope.repos = data;
              $scope.members[i].repoNum = $scope.repos.length;
              ++i;
              $scope.members[i].ghname = $scope.repos.name
              for (y in $scope.repos){
                // var total = 0;
                $http.get("https://api.github.com/repos/" + $scope.members[x].login +"/" + $scope.repos[y].name + "/commits") 
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