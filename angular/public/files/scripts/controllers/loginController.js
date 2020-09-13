
app.controller('loginController', ['$scope', '$http', '$location', '$window', '$timeout', '$cookies', '$interval', '$localStorage', 'dataService',
    async function ($scope, $http, $location, $window, $timeout, $cookies, $interval, $localStorage, dataService) {

        let loginCookie = $cookies.get("login");
        if (loginCookie !== undefined) {
            let userLoggedIn = await dataService.getBackendUid(loginCookie);
            if (userLoggedIn !== 'false') {
                $window.location = '/product';
            }
        }

        $scope.User = {
            'uid': '',
            'UserName': '',
            'email': '',
            'ExpireTime': '',
            'MyListProduct': {}
        }

        $scope.login = async function login() {
            try {
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                let inputmail = $scope.userlogemail;
                if (!(inputmail === "admin")) {
                    if (reg.test(inputmail) === false) {
                        document.getElementById('error-message').innerHTML = "Please enter a valid email address"
                        return;
                    }
                }
                let mail = inputmail.toLowerCase();
                let pass = $scope.userLogPassword;
                var answer;
                var statusCode;

                await $http({
                    method: 'POST',
                    url: 'http://localhost:3000/login',
                    data: { 'email': mail, 'password': pass }
                }).then(function successCallback(response) {
                    answer = response.data;
                    statusCode = response.status;
                    console.log(response);

                }, function errorCallback(response) {
                    let answer = response.data;
                    console.log(response);
                });
                if (answer === 'FAIL') {
                    document.getElementById('error-message').innerHTML = "Incorrect Password";
                }
                else if (answer === 'NOT EXIST') {
                    document.getElementById('error-message').innerHTML = "No such user";
                }
                else if (statusCode === 200) {
                    console.log(answer);
                    let userInfo = answer;
                    let uid = answer.uid;
                    $scope.User.UserName = answer.name;
                    enterToApp(mail, uid);
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        $scope.moveToRegister = function moveToRegister() {
            $window.location = '/register';
        }

        function enterToApp(userlogemail, uid) {
            $scope.User.email = $scope.userlogemail;
            $scope.User.uid = uid;
            var currentTime = new Date();
            if ($scope.remember) {
                currentTime.setDate(currentTime.getDate() + 1);
                $scope.User.ExpireTime = currentTime;
                $cookies.put("login", uid, { 'expires': $scope.User.ExpireTime })
            }
            else {
                currentTime.setMinutes(currentTime.getMinutes() + 30);
                $scope.User.ExpireTime = currentTime;
                $cookies.put("login", uid, { 'expires': $scope.User.ExpireTime })
            }

            dataService.SetUser($scope.User);
            $window.location = '/product';
        }
    }
]);




