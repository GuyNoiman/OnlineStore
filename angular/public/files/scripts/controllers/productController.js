
app.controller('productController', ['$scope', '$http', '$window', '$timeout', '$cookies', '$interval', '$localStorage', 'dataService', '$location',
    async function ($scope, $http, $window, $timeout, $cookies, $interval, $localStorage, dataService, $location) {
        // Check cookies - if login exists and is the currect user - continue. else go back to login 

        let productsDict = Gen.Method.GetProductJson();
        let productsArray = [];
        for (var key in productsDict) {
            productsArray.push(productsDict[key])
        }
        $scope.Product = productsArray;
        dataService.SetProduct($scope.Product);

        var user;
        var usermail;
        user = dataService.GetUser();
        let loginCookie = $cookies.get("login");
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
                    usermail = userLoggedIn
                }
            }
        }


        $scope.MinusOrPlus = function (item, operation) {
            var number = parseInt($('.numberOfItem' + item.id).val());
            if (operation === 'plus') {
                number++;
                $('.numberOfItem' + item.id).val(number);
            }
            else if ('minus') {
                number--;
                if (number < 0) {
                    number = 0;
                }
                $('.numberOfItem' + item.id).val(number);
            }
        }

        $scope.AddToCart = async function (item) {
            var countItem = $('.numberOfItem' + item.id).val();
            try {
                var answer;
                await $http({
                    method: 'PUT',
                    url: 'http://localhost:3000/addProduct',
                    data: { 'userId': loginCookie, 'email': usermail, 'productId': item.id, 'count': countItem }
                }).then(function successCallback(response) {
                    answer = response.data;
                    if (answer === 'FAIL') {
                        document.getElementById('error-message').innerHTML = "fail to add product";
                    }
                }, function errorCallback(response) {
                    if (answer === 'FAIL') {
                        document.getElementById('error-message').innerHTML = "fail to add product";
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }

        $scope.MenuListHover = function (item, type) {
            $('.item').find('.description').removeClass('descriptionHover');
            if (type === 'mouseover') {
                $('.item' + item.id).find('.description').addClass('descriptionHover');
            }
        }

        $scope.goToProduct = function (page) {
            let newPage = `/products/${page}`;
            $window.location = newPage;
        }
    }
]);

