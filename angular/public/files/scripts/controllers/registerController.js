app.controller('registerController', ['$scope', '$http', '$location', '$window', '$timeout', '$cookies', '$interval', '$localStorage', 'dataService',
    async function ($scope, $http, $location, $window, $timeout, $cookies, $interval, $localStorage, dataService) {

        $scope.User = {
            'UserName': '',
            'email': '',
            'ExpireTime': '',
            'MyListProduct': {},
        }

        $scope.register = async function register() {

            var pass = $scope.userResPassword;
            var name = $scope.userResName;
            var email = $scope.userResEmail;

            inputvalidation = testInput();

            if (inputvalidation) {
                var answer;
                await $http({
                    method: 'POST',
                    url: 'http://localhost:3000/register',
                    data: { 'email': email, 'password': pass, 'username': name }
                }).then(async function successCallback(response) {

                    answer = response.data;
                    statusCode = response.status;
                    if (answer === 'FAIL') {
                        document.getElementById('error-message').innerHTML = "User already exist"
                    }
                    else if (answer === 'OK') {
                        moveToLogin();
                    }
                }, function errorCallback(response) {
                    console.log(response);

                });
            }
            else {
                document.getElementById('error-message').innerHTML = "Invalid params"
            }
        }


        function testInput() {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

            if (reg.test($scope.userResEmail) === false) {
                alert('Invalid Email Address');
                return false;
            }
            else if ($scope.userResPassword != $scope.userResPasswordRepeat) {
                //mistakes = mistakes + 'passwords are not matching' + '\n';
                alert('passwords are not matching');
                return false;
            }
            else {
                return true;
            }
        }

        function moveToLogin() {
            $window.location = '/login'
        }
    }
]);