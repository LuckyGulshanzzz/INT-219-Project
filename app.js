var express        = require("express"),
    app            =express(), 
    bodyParser     =require("body-parser"),
    mongoose       =require("mongoose"), 
    Car            =require("./models/car"),
    seedDB         =require("./seeds"),
    Comment        =require("./models/comment"),
    passport       =require("passport"),
    LocalStrategy  =require("passport-local"),
    User           =require("./models/user"),
    methodOverride =require("method-override"),
    flash          =require("connect-flash");
    
    
var commentRoutes =require("./routes/comments"),
    carRoutes     = require("./routes/cars"),
    indexRoutes   = require("./routes/index");
   
   
   
   
   
   // seedDB();
   
  mongoose.Promise = global.Promise;

const databaseUri = "mongodb+srv://Gulshan:123@cluster0.3i7ip.mongodb.net/top_gear?retryWrites=true&w=majority";

mongoose.connect(databaseUri,{ useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));
  

//mongoose.connect("mongodb://localhost/top_gear", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true})) ;  
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Dinnie is poopie",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});




app.use("/",indexRoutes);
app.use("/cars/:id/comments",commentRoutes);
app.use("/cars",carRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The TopGear Server Has Started! ");
});

https://www.loom.com/share/7fbdb0c0a4bd4938957e680553f17ab8