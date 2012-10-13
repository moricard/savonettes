'use strict';                                                                                                                                                                                                                             

/* App Module */                                                                                                                                                                                                                          

var app = angular.module('savonette', ['fats', 'recipes']).
    config(function($routeProvider, $locationProvider) {                                                                                                                                                                                    
        $routeProvider.
            when('/', {templateUrl: 'list.html'}).
            when('/recipes/new', {templateUrl: 'partials/recipebuilder.html'}).
            when('/fats/edit', {templateUrl: 'partials/fatadmin.html'}).
            when('/fats/edit/:id', {templateUrl: 'partials/fatadmin.html'}). 
            when('/fats', {templateUrl: 'partials/fatdetail.html'}).
            when('/fats/new', {templateUrl: 'partials/fatadmin.html'});
            //otherwise({redirectTo: '/'});
        //$locationProvider.html5Mode(true);
    });

app.controller('FatsController', function($scope, $location, Fat, $routeParams){
    $scope.fats = Fat.query();
    var id = $routeParams.id;
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

    $scope.select = function(id){
        $scope.fat = $scope.fats.filter(function(el){
            return el._id === id;
        })[0];
    };

    $scope.edit = function(){
        $location.path('/fats/edit');
        //$scope.fat = fat;
    };

    $scope.new = function(){
        $scope.fat = {};
    };
});

app.controller('RecipesController', function($scope, Recipe){
    $scope.recipes = Recipe.query();
    $scope.addFat = function(fat){
        
    }
});
app.controller('RecipeEditController', function($scope, Recipe){
    $scope.recipe = Recipe.get({id: $scope.recipe._id});
});

// Resources
angular.module('fats', ['ngResource']).
    factory('Fat', function($resource) {
        return $resource('/api/fats/:id', 
            {},{
            query:  {method:'GET', isArray: true},
            update: {method:'PUT'},
            save:   {method:'POST'},
            delete: {method:'DELETE'},
            get:    {method:'GET', isArray: false}
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
