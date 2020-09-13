app.controller('checkoutController', ['$scope', '$http', '$location', '$window', '$timeout', '$cookies', '$interval', '$localStorage', 'dataService',
    async function ($scope, $http, $location, $window, $timeout, $cookies, $interval, $localStorage, dataService) {

        const loginCookie = $cookies.get("login");
        var user = dataService.GetUser();
        if (!user) {
            if (loginCookie === undefined) {
                //No session, please reconnect
                $window.location.href = '/login';
            } else {
                let userLoggedIn = await dataService.getBackendUid(loginCookie);
                if (userLoggedIn === 'false') {
                    //No session, please reconnect
                    $window.location.href = '/login';
                } else {
                    usermail = await userLoggedIn
                    
                }
            }
        }
        try {
            await $http({
                method: 'POST',
                url: 'http://localhost:3000/cart',
                data: { email: usermail }
            }).then(function successCallback(response) {
                var productsJson = Gen.Method.GetProductJson();
                let smallCart = []
                if (Object.keys(response.data).length === 0) {
                    document.getElementById('error-message').innerHTML = "No items in cart, you can add items in the home page"
                }
                for (var key in response.data) {
                    smallCart.push(productsJson[key].name)
                }
                $scope.cartItems = smallCart;
            }, function errorCallback(response) {
                document.getElementById('error-message').innerHTML = "Error loading users"
            });
        }
        catch (err) {
            console.log(err);
        }

        $scope.submitPurchase = async function () {
            try {
                var confirmed = confirm("Are you sure you want to checkout?")
                if (!confirmed) {
                    return
                }
                await $http({
                    method: 'POST',
                    url: 'http://localhost:3000/purchaseOrder',
                    data: { email: usermail }
                }).then(function successCallback(response) {
                    //purchased
                }, function errorCallback(response) {
                    $window.alert("Error while purchasing please try again")
                    document.getElementById('error-message').innerHTML = "Error with purchase"

                });
            } catch (err) {
                console.log(err)
            }
        }
    }
]);