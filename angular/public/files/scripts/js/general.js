

var Gen = {};

Gen = {

    Method: {
        GetProductJson: function () { 
            return GetProducts();
        },
    }
};




function GetProducts() {
    var json = {
        "1": {
            "id": "1",
            "name": "Spathiphyllum",
            "src": "files/asset/images/parket/product/1.jpg",
            "price": 15,
            "description" : "The plant does not need large amounts of light or water to survive"
        },

        "2": {
            "id": "2",
            "name": "Sensivaria",
            "src": "files/asset/images/parket/product/2.jpg",
            "description" : "Air Purifier plant, great for indoor/outdoor",
            "price": 30
        },

        
        "3": {
            "id": "3",
            "name": "Codiaeum variegatum",
            "src": "files/asset/images/parket/product/3.jpg",
            "description" : "species of plant in the genus Codiaeum, which is a member of the family Euphorbiaceae",
            "price": 80
        },


        "4": {
            "id": "4",
            "name": "Hadera",
            "src": "files/asset/images/parket/product/4.jpg",
            "description" : "Ivies are very popular in cultivation within their native range and compatible climates elsewhere",
            "price": 22
        },


        "5": {
            "id": "5",
            "name": "Calathea",
            "src": "files/asset/images/parket/product/5.jpg",
            "description" : "become one of the most popular houseplants to own",
            "price": 19
        },

        "6": {
            "id": "6",
            "name": "Hypoestes",
            "src": "files/asset/images/parket/product/6.jpg",
            "description" : "The Latin specific epithet phyllostachya means “with a leaf spike",
            "price": 77
        },        

    }

    return json;
}


