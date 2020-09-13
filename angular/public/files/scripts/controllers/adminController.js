
app.controller('adminController', ['$scope', '$http', '$location', '$window', '$timeout', '$cookies', '$interval', '$localStorage', 'dataService',
async function ($scope, $http, $location, $window, $timeout, $cookies, $interval, $localStorage, dataService) {
    
    $scope.$on('$viewContentLoaded', async function() {
        try {
            var loginCookie = $cookies.get("login");
            if (loginCookie === undefined) {
                //No session, please reconnect
                $window.location.href = '/login';
            } else {
                let userLoggedIn = await dataService.getBackendUid(loginCookie);
                if (userLoggedIn === 'false') {
                    //No session, please reconnect
                    $window.location.href = '/login';
                } else if (userLoggedIn !== "admin") {
                    //Not an admin
                    $window.location.href = '/product';
                }
            } 
        
            await $http({
                method: 'GET',
                url: 'http://localhost:3000/adminLoadData',
                data: {}
            }).then(function successCallback(response) {
                $scope.savedUsers = changeUsersFormat(response.data);
                $scope.userLogins = response.data.logins;
                $scope.userCart = response.data.cart;
                }, function errorCallback(response) {
                    document.getElementById('error-message').innerHTML = "Error loading users"
            });   
        }
        catch (err) {
            console.log(err);
        }
    })

    $scope.deleteUser = async function deleteUser(userEmail) {
        try {
            if (userEmail === "admin") {
                $window.alert("Cannot remove admin user");
                return
            }
            var confirmed = confirm("Are you sure you want to delete this user?");
            if (!confirmed) {
                return
            }
            await $http({
                method: 'POST',
                url: 'http://localhost:3000/DeleteUser',
                data: {email: userEmail}
            }).then(function successCallback(response) {
                $window.alert("User removed sucessfuly");
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    $scope.getLogins = async function getLogins(userName) {
        try {
            var userLogins = [];
            await $http({
                method: 'GET',
                url: 'http://localhost:3000/adminLoadLogins',
                data: {}
            }).then(function successCallback(response) {
                var logins = response.data;
                for (var login in logins) {
                    if (login === userName) {
                        userLogins.push(logins[login]);
                    }
                }
                $window.alert(userLogins);
                }, function errorCallback(response) {
                    document.getElementById('error-message').innerHTML = "Error loading users"
            });   
        }
        catch (err) {
            console.log(err);
        }
    }

    function changeUsersFormat(userslist) {
        var finalList = [];
        var index = 1;
        for (var key in userslist) {
            var users = JSON.parse(userslist[key])
            users.index = index;
            index = index + 1;
            finalList.push(users);
        }
        return finalList;
    }
}
]);




