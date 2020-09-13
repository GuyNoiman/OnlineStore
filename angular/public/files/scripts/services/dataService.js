// const server = require("../../../server");
app.service('dataService', function () {
    
    
    var user = {};
    var products = {};

    this.SetUser = function (user) {
        this.user = user;
    };

    this.GetUser = function () {
        return this.user;
    };


    this.SetProduct = function (products) {
        this.products = products;
    };

    this.GetProduct = function () {
        return this.products;
    };

    
    this.getBackendUid = async function (uid) {
        var responseT;
        //postBody = JSON.stringify({'uid': uid})
        let response = await fetch("http://localhost:3000/auth", {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'uid': uid})})
            responseT = await response.text();
        if (responseT === 'false') {
            return 'false';
        } else {
            return responseT;
        }
    }

    

});