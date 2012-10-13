'use strict';                                                                                                                                                                                                                             

/* App Module */                                                                                                                                                                                                                          

angular.module('savonette', ['fats', 'recipes']).
    config(function($routeProvider, $locationProvider) {                                                                                                                                                                                    
        $routeProvider.
            when('/', {controller: HomeController, templateUrl: 'list.html'}).
            //when('/recipes', {templateUrl: 'partials/recipes-list.html',   controller: RecipesListCtrl}).
            when('/recipes/new', {templateUrl: 'partials/recipebuilder.html', controller: RecipesController}).
            //when('/recipes/:recipeId', {templateUrl: 'partials/recipe-detail.html', controller: RecipeDetailCtrl}).
            when('/fats/edit', {templateUrl: 'partials/fatadmin.html', controller: FatsController}).
            when('/fats/edit/:id', {templateUrl: 'partials/fatadmin.html'}). 
            when('/fats', {templateUrl: 'partials/fatdetail.html', controller: FatsController}).
            when('/fats/new', {templateUrl: 'partials/fatadmin.html', controller: FatsController}).
            otherwise({redirectTo: '/'});
    });

function FatsController($scope, $location, Fat, $routeParams){
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
};

function RecipesController($scope, Recipe){
    $scope.recipes = Recipe.query();
    $scope.addFat = function(fat){
        
    }
};
function RecipeEditController($scope, Recipe){
    $scope.recipe = Recipe.get({id: $scope.recipe._id});
};

function HomeController($scope, $http){

};

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
