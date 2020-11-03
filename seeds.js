var mongoose = require("mongoose");
var Car      = require("./models/car");
var Comment  = require("./models/comment");

var data=[
    {
       name: "La Ferrari",
       image: "https://images.unsplash.com/photo-1541846476-8e81bf093904?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
       description: "It boasts the most extreme performance ever achieved by a Ferrari production car and features the most advanced and innovative technical solutions which will, in the future, filter down to the rest of the Ferrari range. The LaFerrari is Ferrari’s first ever production car to be equipped with the F1-derived hybrid solution – the HY-KERS system – which combines an electric motor producing over 150 CV with the most powerful incarnation yet of Ferrari’s classic V12, with 800 CV at 9000 rpm."
    },
    {
       name: "Buggati Veyron",
       image: "https://images.unsplash.com/photo-1550615162-30dcc978d172?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
       description: "Since its launch in 2005, the Bugatti Veyron has been regarded as a supercar of superlative quality. It was a real challenge for developers to fulfil the specifications that the new supercar was supposed to meet: over 1,000 hp, a top speed of over 400 km/h and the ability to accelerate from 0 to 100 in under three seconds. Even experts thought it was impossible to achieve these performance specs on the road. But that was not all."
    },
    {
       name: "BMW M3",
       image: "https://images.unsplash.com/photo-1593465234573-3a2b343ab4eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
       description: "The BMW M3 is a high-performance version of the BMW 3 Series, developed by BMW's in-house motorsport division, BMW M GmbH. M3 models have been produced for every generation of 3 Series since the E30 M3 was introduced in 1986. The initial model was available in a coupé body style, with a convertible body style added soon after"
    }
    
    
    ]







function seedDB(){

Car.deleteMany({}, function(err){
    if(err){
        console.log(err);
    }
    console.log("Removed  Cars");
    data.forEach(function(seed){
    Car.create(seed,function(err,car){
        if(err){
            console.log(err);
        }else{
            console.log("added a car");
            Comment.create(
                {
                    text: "I love this website :9",
                    author: "Jeremy Clarkson"
                },function(err,comment){
                    if(err){
                        console.log(err);
                    }else{
                      car.comments.push(comment);
                      car.save();
                      console.log("created a comment");
                    }
                });
        }
    });
  });
});

}

module.exports= seedDB;