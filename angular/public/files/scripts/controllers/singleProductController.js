app.controller('singleProductController', ['$scope', '$routeParams', '$http', '$location', '$window', '$timeout', '$cookies', '$interval', '$localStorage', 'dataService',
    async function ($scope, $routeParams, $http, $location, $window, $timeout, $cookies, $interval, $localStorage, dataService) {
        
        var user = dataService.GetUser();
        var loginCookie = $cookies.get("login");
        if (!user) {
            if (loginCookie === undefined) {
                //No session, please reconnect
                $window.location.href = '/login';
            } else {
                let userLoggedIn = await dataService.getBackendUid(loginCookie);
                if (userLoggedIn === 'false') {
                    //No session, please reconnect
                    $window.location.href = '/login';
                }
            } 
        }
        
        var idnum = $routeParams.productid;
        var productsDict = Gen.Method.GetProductJson();
        var proudctInfo = productsDict[idnum];
        $scope.proudctInfo = proudctInfo;
    }
]);