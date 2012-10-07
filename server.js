// Server API pour l'application de savonnettes...
var version = '1.0.0-SNAPSHOT';
var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose'),
    util = require('util'),
    db = mongoose.createConnection('localhost', 'savonettes');

var app = express();

// Config

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({ 
        dumpExceptions: true, 
        showStack: true 
    }));
});

var Schema = mongoose.Schema;

// - - - -
// Models
// - - - -

var KOH = {name: 'KOH', factor: 1};
var NaOH = {name: 'NaOH', factor: 1.4025};

var BaseFatSchema = new Schema({
    name: String,
    SAPValue: Number,
    description: String,
    available: Boolean,
    quantity: Number
});

var EssentialOilSchema = new Schema({
    name: String,
    properties: String,
    available: Boolean,
    quantity: Number
});

var IngredientSchema = new Schema({
    type: {type: String, enum:['Lye', 'Base', 'Essential']},
    ingredient: Schema.Types.Mixed,
    quantity: Number
});

var RecipeSchema = new Schema({
    title : String,
    author: String,
    notes:  String,
    date:   { type: Date, default: Date.now},
    ingredients: [IngredientSchema]
});

var RecipesSchema = new Schema({
    recipies: [RecipeSchema]
});

// Database

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {});

var BaseFat = db.model('BaseFat', BaseFatSchema),
    EssentialOil = db.model('EssentialOil', EssentialOilSchema),
    Ingredient = db.model('Ingredient', IngredientSchema),
    Recipe = db.model('Recipe', RecipeSchema),
    Recipes = db.model('Recipes', RecipesSchema);

// - - - - - -
// Controllers
// - - - - - -

// returns the status of the api, with version
app.get('/api', function (req, res) {
    res.send('Status: up and running, version ' + version);
});

// // Base Fats

// returns the list of all base fats in the db
app.get('/api/fats', function (req, res) {
    return BaseFat.find(function (err, fats){
        if(!err) {
            res.send(fats);
        } else {
            return console.log(err);
        }
    });
});

// Create a Base fat
app.post('/api/fats', function (req, res) {
    var fat;
    console.log("POST: ");
    console.log(req.body);
    fat = new BaseFat({
        name : req.body.name,
        SAPValue: req.body.SAPValue,
        description: req.body.description,
        available: req.body.available,
        quantity: req.body.quantity
    });
    fat.save(function (err) {
        if (!err) {
            return console.log("Created fat with id: " + fat._id);
        } else {
            return console.log(err);
        }
    });
    return res.send(fat);
});

// Read a Base fat
app.get('/api/fats/:id', function (req, res) {
    return BaseFat.findById(req.params.id, function(err, fat) {
        if (!err) {
            return res.send(fat);
        } else {
            return console.log(err);
        }
    });
});

// Update a Base fat
app.put('/api/fats/:id', function (req, res) {
    return BaseFat.findById(req.params.id, function (err, fat) {
        fat.name = req.body.name;
        fat.SAPValue = req.body.SAPValue;
        fat.description = req.body.description;
        fat.available = req.body.available;
        fat.quantity = req.body.quantity;
        return fat.save(function (err) {
            if (!err) {
                console.log("Updated fat with id: " + fat._id);
            } else {
                console.log(err);
            }
            return res.send(fat);
        });
    });
});

// Delete a Base fat
app.delete('/api/fats/:id', function (req, res) {
    return BaseFat.findById(req.params.id, function (err, fat) {
        return fat.remove(function (err) {
            if (!err) {
                console.log("Deleted fat with id: " + fat._id);
            } else {
                console.log(err);
            }
            return res.send('');
        });
    });
});

// // Essential Oils

// returns the list of all essential oils in the db
app.get('/api/oils', function (req, res) {
    return EssentialOil.find(function (err, oils){
        if(!err) {
            res.send(oils);
        } else {
            return console.log(err);
        }
    });
});

// Create an essential oil
app.post('/api/oils', function (req, res) {
    var oil;
    console.log("POST: ");
    console.log(req.body);
    oil = new EssentialOil({
        name : req.body.name,
        description: req.body.description,
        available: req.body.available,
        quantity: req.body.quantity
    });
    oil.save(function (err) {
        if (!err) {
            return console.log("Created essential oil with id: " + oil._id);
        } else {
            return console.log(err);
        }
    });
    return res.send(oil);
});

// Read an essential oil
app.get('/api/oils/:id', function (req, res) {
    return EssentialOil.findById(req.params.id, function(err, oil) {
        if (!err) {
            return res.send(oil);
        } else {
            return console.log(err);
        }
    });
});

// Update an essential oil
app.put('/api/oils/:id', function (req, res) {
    return EssentialOil.findById(req.params.id, function (err, oil) {
        oil.name = req.body.name;
        oil.SAPValue = req.body.SAPValue;
        oil.description = req.body.description;
        oil.available = req.body.available;
        oil.quantity = req.body.quantity;
        return oil.save(function (err) {
            if (!err) {
                console.log("Updated essential oil with id: " + oil._id);
            } else {
                console.log(err);
            }
            return res.send(oil);
        });
    });
});

// Delete an essential oil
app.delete('/api/oils/:id', function (req, res) {
    return EssentialOil.findById(req.params.id, function (err, oil) {
        return oil.remove(function (err) {
            if (!err) {
                console.log("Deleted essential oil with id: " + oil._id);
            } else {
                console.log(err);
            }
            return res.send('');
        });
    });
});



// // Recipes

// returns the list of all essential recipies in the db
app.get('/api/recipes', function (req, res) {
    return Recipe.find(function (err, recipes){
        if(!err) {
            res.send(recipes);
        } else {
            return console.log(err);
        }
    });
});

// Create a recipe
app.post('/api/recipes', function (req, res) {
    var recipe;
    console.log("POST: ");
    console.log(req.body);
    recipe = new Recipe({
        author: req.body.author,
        title: req.body.title,
        notes: req.body.notes 
    });
    recipe.save(function (err) {
        if (!err) {
            return console.log("Created recipe with id: " + recipe._id);
        } else {
            return console.log(err);
        }
    });
    return res.send(recipe);
});

// Read an recipe
app.get('/api/recipes/:id', function (req, res) {
    return Recipe.findById(req.params.id, function(err, recipe) {
        if (!err) {
            return res.send(recipe);
        } else {
            return console.log(err);
        }
    });
});

// Update an recipe
app.put('/api/recipes/:id', function (req, res) {
    return Recipe.findById(req.params.id, function (err, recipe) {
        recipe.title = req.body.title;
        recipe.notes = req.body.notes;
        recipe.ingredients = req.body.ingredients;
        return recipe.save(function (err) {
            if (!err) {
                console.log("Updated recipe with id: " + recipe._id);
            } else {
                console.log(err);
            }
            return res.send(recipe);
        });
    });
});

// Delete an recipe
app.delete('/api/recipes/:id', function (req, res) {
    return Recipe.findById(req.params.id, function (err, recipe) {
        return recipe.remove(function (err) {
            if (!err) {
                console.log("Deleted recipe with id: " + recipe._id);
            } else {
                console.log(err);
            }
            return res.send('');
        });
    });
});

// Test cases


// Launch server

app.listen(4242);
