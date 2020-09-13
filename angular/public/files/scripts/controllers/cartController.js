
app.controller('cartController', ['$scope', '$http', '$location', '$window', '$timeout', '$cookies', '$interval', '$localStorage', 'dataService',
    async function ($scope, $http, $location, $window, $timeout, $cookies, $interval, $localStorage, dataService) {
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
                } else { 
                    usermail = await userLoggedIn
                }
            } 
        }
        try {
            
            var productsJson = Gen.Method.GetProductJson();
            
            await $http({
                method: 'POST',
                url: 'http://localhost:3000/cart',
                data: {email: usermail}
            }).then(function successCallback(response) {
                if (Object.keys(response.data).length === 0 || response.data === "FAIL") {
                    document.getElementById('error-message').innerHTML = "No items in cart, you can add items in the home page"
                    return
                }
                $scope.cartProducts = setCartProducts(response.data, productsJson);
            }, function errorCallback(response) {
                console.log(response);                 
            });    
        } catch (err) {
            throw err;
        }

        function setCartProducts(cartItems, allProducts) {
            let finalCart = {};
            for (var key in cartItems) {
                finalCart[key] = allProducts[key];
                finalCart[key].count = cartItems[key];
            }
            return finalCart;
        }

        $scope.removeItemFromCart = async function removeItemFromCart(itemId) {
            await $http({
                method: 'POST',
                url: 'http://localhost:3000/removeItemFromCart',
                data: {email: usermail, itemId: itemId}
            }).then(function successCallback(response) {
                console.log("im here");
                $window.location.reload();
                console.log(response);
                return;
            }, function errorCallback(response) {
                console.log(response);
                document.getElementById('error-message').innerHTML = "Error Deleting item"
            });
        }
    }
]);