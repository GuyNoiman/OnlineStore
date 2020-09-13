app.controller('aboutController', ['$scope', '$http', '$location', '$window', '$timeout', '$cookies', '$interval', '$localStorage', 'dataService',
    async function ($scope, $http, $location, $window, $timeout, $cookies, $interval, $localStorage, dataService) {
        try {
            const user = dataService.GetUser();
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
        }
        catch (err) {
            console.log(err);
        }
    }


    
]);