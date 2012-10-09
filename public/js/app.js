'use strict';                                                                                                                                                                                                                             

/* App Module */                                                                                                                                                                                                                          

angular.module('savonette', ['fats', 'recipes']).
    config(['$routeProvider', function($routeProvider) {                                                                                                                                                                                    
        $routeProvider.
            when('/', {controller: HomeController, templateUrl: 'list.html'}).
            //when('/recipes', {templateUrl: 'partials/recipes-list.html',   controller: RecipesListCtrl}).
            //when('/recipes/:recipeId', {templateUrl: 'partials/recipe-detail.html', controller: RecipeDetailCtrl}).
            when('/fats/edit', {templateUrl: 'partials/fatadmin.html', controller: FatsController}).
            when('/fats', {templateUrl: 'partials/fatdetail.html', controller: FatsController}).
            when('/fats/new', {templateUrl: 'partials/fatadmin.html', controller: FatsController}).
            otherwise({redirectTo: '/'});
    }]);

function FatsController($scope, $location, Fat){
    $scope.fats = Fat.query();
    $scope.save = function(){
        if ($scope.fat._id){
            Fat.update({id: $scope.fat._id}, $scope.fat, function(fat){
                //Nothing to do here 
            });
        } else {
            Fat.save($scope.fat, function(fat) {
                $scope.fats.push(fat);
                $scope.fat = {};
            });
        }
    };
    
    $scope.delete = function(){
        Fat.delete({id: $scope.fat._id}, function(){
            $scope.fats.splice($scope.fats.indexOf($scope.fat),1);
            $scope.fat = {};
        });
    };

    $scope.select = function(fat){
        $scope.fat = fat;
    };

    $scope.edit = function(fat){
        $location.path('/fats/edit');
        $scope.fat = fat;
    };

    $scope.new = function(){
        $scope.fat = {};
    };
};

function RecipesController($scope, Recipe){

};

function HomeController($scope, $http){

};

// Resources
angular.module('fats', ['ngResource']).
    factory('Fat', function($resource) {
        return $resource('/api/fats/:id', 
            {},{
            query: {method:'GET', isArray: true},
            update: {method:'PUT'},
            save:   {method:'POST'},
            delete: {method:'DELETE'}
        });
    });
angular.module('recipes', ['ngResource']).
    factory('Recipe', function($resource) {
        return $resource('/api/recipes/:_id',{},{
            query: {method:'GET', isArray: true},
            update:{method:'PUT'},
            save:  {method:'POST'},
            delete:{method:'DELETE'}
        });
    });
