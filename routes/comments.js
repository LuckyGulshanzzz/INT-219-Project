
var express = require("express");
var router  = express.Router({mergeParams: true});
var Car     = require("../models/car");
var Comment = require("../models/comment");





router.get("/new", isLoggedIn, function(req,res){
   Car.findById(req.params.id,function(err,car){
       if(err){
           console.log(err);
       }else{
           res.render("comments/new", {car:car});
       }
   });
    
});

router.post("/", isLoggedIn, function(req,res){
    Car.findById(req.params.id, function(err, car) {
        if(err){
            console.log(err);
            res.redirect("/cars");
        }else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.id= req.user._id;
                    comment.author.username= req.user.username;
                    comment.save();
                    car.comments.push(comment);
                    car.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/cars/" + car._id);
                }
            });
        }
    });
});



router.get("/:comment_id/edit",checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {car_id: req.params.id, comment:foundComment});
        }
    });
    
});



router.put("/:comment_id",checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/cars/" + req.params.id);
        }
    })
})



router.delete("/:comment_id",checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Commment deleted");
            res.redirect("/cars/" + req.params.id);
        }
    });
});



function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id , function(err, foundComment) {
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
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