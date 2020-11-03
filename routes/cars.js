var express = require("express");
var router  = express.Router();
var Car     = require("../models/car");






router.get("/",function(req,res){
   
    Car.find({}, function(err, allCars){
        if(err){ 
            console.log(err);
        }else{
            res.render("cars/index",{cars:allCars, currentUser: req.user});
        }
    });   
});

router.post("/" , isLoggedIn, function(req,res){
   var name   = req.body.name;
   var image  = req.body.image;
   var desc   = req.body.description;
   var price  = req.body.price;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newCar = {name: name, price: price, image: image, description:desc, author:author}
   Car.create(newCar, function(err, newlyCreated){
    if(err){
        console.log("err")
    }else{
        res.redirect("/cars"); 
    }  
   });
  
   
});

router.get("/new", isLoggedIn,function(req, res) {
   res.render("cars/new"); 
});

router.get("/:id",function(req, res) {
    
    Car.findById(req.params.id).populate("comments").exec(function(err,foundCar){
      if(err){
          console.log(err);
      }else{
          res.render("cars/show", {car:foundCar});
      }  
    });
    });
    
    
    
    
router.get("/:id/edit", checkCarOwnership, function(req, res) {
   Car.findById(req.params.id, function(err, foundCar){
       if(err){
           console.log(err);
       }
       res.render("cars/edit", {car : foundCar});  
        });
    
});   


router.put("/:id",checkCarOwnership, function(req,res){
    Car.findByIdAndUpdate(req.params.id, req.body.car, function(err, updatedCar){
        if(err){
            res.redirect("/cars")
            console.log(err);
        }else{
            res.redirect("/cars/"+ req.params.id);
        }
    });
});




router.delete("/:id",checkCarOwnership,function(req,res){
    Car.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/cars");
        }else{
           res.redirect("/cars"); 
        }
    });
});


function checkCarOwnership(req,res,next){
    if(req.isAuthenticated()){
        Car.findById(req.params.id , function(err, foundCar) {
            if(err){
                req.flash("error", "Car not found");
                res.redirect("back");
            }else{
                if(foundCar.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back")
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back")
    }
}






      
    
    
    
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
     req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

    
    
module.exports=router;    
    