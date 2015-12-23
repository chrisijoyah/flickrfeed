(function () {

angular.module('flickrfeed', ['ui.router'])
  .factory('flickrService', ['$http', '$q', function($http, $q){
    var deferred = $q.defer();

    var successCallback = function (response) {
      deferred.resolve(response.data);
    }

    var errorCallback = function (response) {
      console.log(response);
    }

    return {
      getItems: function () {
        $http.jsonp('https://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&jsoncallback=JSON_CALLBACK')
          .then(successCallback, errorCallback);

        return deferred.promise;        
      },
      avatar: function (user_id) {
        return 'http://www.flickr.com/buddyicons/' + user_id + '.jpg';
      },
      authorUrl: function (user_id) {
        return 'http://www.flickr.com/photos/' + user_id;
      }
    }

  }])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('list', {
        url: '/',
        templateUrl: "partials/list.html",
        controller: 'ListController'
      })
      .state('detail', {
        url: '/item/:id',
        templateUrl: "partials/detail.html",
        controller: 'DetailController'
      });
    
  }])
  .controller('ListController', ['$scope', '$http', 'flickrService', function($scope, $http, flickrService){
    
    $scope.items;
    $scope.author_url;
    $scope.avatar;
    var promise = flickrService.getItems(); 

    promise.then(function (response) {
      $scope.items = response.items;

      $scope.author_url = function (user_id) {
        return flickrService.authorUrl(user_id);
      }

      $scope.avatar = function (user_id) {
        return flickrService.avatar(user_id);
      } 

    });


  }])
  .controller('DetailController', ['$scope', '$stateParams', 'flickrService', function($scope, $stateParams, flickrService){
    
    $scope.item;
    $scope.author_url;
    $scope.avatar;
    var promise = flickrService.getItems();
    var id = $stateParams.id;

    promise.then(function (response) {
      $scope.item = response.items[id - 1];

      $scope.author_url = function (user_id) {
        return flickrService.authorUrl(user_id);
      }

      $scope.avatar = function (user_id) {
        return flickrService.avatar(user_id);
      } 

    });

    
  }]);

})();






















