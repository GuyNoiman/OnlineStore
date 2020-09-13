app.controller('menuBarController', ['$scope', '$http', '$window', '$timeout', '$cookies', '$interval', '$localStorage', 'dataService', '$location',
    async function ($scope, $http, $window, $timeout, $cookies, $interval, $localStorage, dataService, $location) {
        
        $scope.showAdminPageLink = false;
        var loginCookie = $cookies.get("login");
        let userLoggedIn = await dataService.getBackendUid(loginCookie)
        if (userLoggedIn === "admin") {
            $scope.showAdminPageLink = true;
            $scope.$apply()
        } else {
            $scope.showAdminPageLink = false;
            $scope.$apply()
        }     
        $scope.goTo = function (page) {
            $window.location = page;
        }



        $scope.logout = async function () {
            try {
                const loginCookie = $cookies.get('login');
                await $http({
                    method: 'POST',
                    url: 'http://localhost:3000/logout',
                    data: { uid: loginCookie }
                }).then(function successCallback(response) {
                    $cookies.remove('login');
                    $window.location = '/login';
                })
            } catch (err) {
                console.log(err);
            }

        }


        $scope.about = function () {
            $window.location = '/about';
        }
    }


])        