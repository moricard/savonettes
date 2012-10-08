'use strict';                                                                                                                                                                                                                             

/* App Module */                                                                                                                                                                                                                          

angular.module('savonette', ['fats']).
    config(['$routeProvider', function($routeProvider) {                                                                                                                                                                                    
        $routeProvider.
            when('/', {controller: ListCtrl, templateUrl: 'list.html'}).
            //when('/recipes', {templateUrl: 'partials/recipes-list.html',   controller: RecipesListCtrl}).
            //when('/recipes/:recipeId', {templateUrl: 'partials/recipe-detail.html', controller: RecipeDetailCtrl}).
            when('/fats', {templateUrl: 'partials/fats-list.html', controller: FatsController}).
            when('/fats/add', {templateUrl: 'partials/fatform.html', controller: FatsController}).
            otherwise({redirectTo: '/'});
    }]);

function FatsController($scope, Fat){
    $scope.fats = Fat.query();
    $scope.save = function(){
        Fat.save($scope.fat, function(fat) {
            $scope.fats.push(fat);
            $scope.fat = {};
        });
    };
    $scope.delete = function(fat){
        Fat.delete(fat, function(){
            $scope.fats.splice($scope.fats.indexOf(fat),1);
            $scope.fat = {};
        });
    };
    $scope.select = function(fat){
        $scope.fat = fat;
    };
};

function ListCtrl($scope, $http){

};

angular.module('fats', ['ngResource']).
    factory('Fat', function($resource) {
        return $resource('/api/fats/:_id', 
            {},{
            query: {method:'GET', isArray: true},
            update: {method:'PUT'},
            save:   {method:'POST'},
            delete: {method:'DELETE'}
        });
    });
