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

    var userDataCall;
    var repoDataCall;
    var repoCommitNum;
    var userRepos;
    
    $http.get($scope.orgUrl + $scope.orgname + "/members" + $scope.authKey)
      .success(function(data){
        $scope.companyName = $scope.orgname;

        angular.forEach(data, function(userData) {         

          userDataCall = $http.get($scope.usersUrl + userData.login + $scope.authKey);
                    
          repoDataCall = $http.get($scope.usersUrl + userData.login + "/repos" + $scope.authKey + "&page=1&per_page=100");
          repoDataCallTwo = $http.get($scope.usersUrl + userData.login + "/repos" + $scope.authKey + "&page=2&per_page=100");
          
          $q.all([userDataCall, repoDataCall, repoDataCallTwo]).then(function(data){
            $scope.members.push({login: userData.login, fullName: data[0].data.name, repoNum: data[0].data.public_repos, userGitUrl: data[0].data.html_url, followers: data[0].data.followers, following: data[0].data.following});
            
            userRepos = [];
            angular.forEach(data[1].data, function(data) {

              if(data.owner && data.owner.login === userData.login){
                userRepos.push(data.name)
              }

            });

            angular.forEach(data[2].data, function(data) {
              if(data.owner && data.owner.login === userData.login){
                userRepos.push(data.name);
              }

            });

            $scope.getCommitCount(userRepos, userData.login, $scope.members.length-1);
            
          });
              
      });      
      $scope.loaded = true;             
    }).error(function(){
        $scope.orgNotFound = true;
    });
  }

  $scope.getCommitCount = function(repoNames, username, index){
    var commitCount = 0;
    var commitsList = [];
    angular.forEach(repoNames, function(name) {
      commitsList.push($http.get($scope.reposUrl + username + "/" + name + "/stats/participation" + $scope.authKey));        

    });

    $q.all(commitsList).then(function(data){
      
      angular.forEach(data, function(commitData) {
        
        if(commitData.data.owner){
           for(var i=0; i<commitData.data.owner.length; i++){
              commitCount += commitData.data.owner[i];            
            } 
        }
      });

      $scope.members[index].commits = commitCount;
     
    });    
  }
});
