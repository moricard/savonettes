function FatsController($scope, $http){
    $http.get('/api/fats').success(function (data) {
        $scope.fats = data;
    });

    update = function () {

    };
}
