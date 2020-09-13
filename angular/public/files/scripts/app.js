

var app = angular.module('myApp', ['ngCookies', 'ngRoute', 'ngStorage']);

app.config(function ($routeProvider, $locationProvider) {

    $routeProvider

        .when('/', { //  Deafult
            templateUrl: 'files/views/login.html',
            controller: 'loginController'
        })

        .when('/login', {
            templateUrl: 'files/views/login.html',
            controller: 'loginController'
        })  
        
        .when('/register', {
            templateUrl: 'files/views/register.html',
            controller: 'registerController'
        }) 
        
        .when('/product', {
            templateUrl: 'files/views/product.html',
            controller: 'productController'
        })  

        .when('/cart', {
            templateUrl: 'files/views/cart.html',
            controller: 'cartController'
        })

        .when('/admin', {
            templateUrl: 'files/views/admin.html',
            controller: 'adminController'
        })

        .when('/checkout', {
            templateUrl: 'files/views/checkout.html',
            controller: 'checkoutController'
        })

        .when('/header', {
            templateUrl: 'files/templates/home_files/header.html',
            controller: 'menuBarController'
        }) 

        .when('/about', {
            templateUrl: 'files/views/about.html',
            controller: 'aboutController'
        })
       
        .when('/products/:productid', {
            templateUrl: 'files/views/singleProduct.html',
            controller: 'singleProductController'
        })
        
    
    $locationProvider.html5Mode({enabled: true, requireBase: false})
});


app.directive('header', function () {
    return {
        templateUrl: '/files/templates/header.html',
        controller: 'menuBarController'
    };
});
