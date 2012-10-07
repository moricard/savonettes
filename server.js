// Server API pour l'application de savonnettes...

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

// Models

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

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    var BaseFat = db.model('BaseFat', BaseFatSchema),
        EssentialOil = db.model('EssentialOil', EssentialOilSchema),
        Ingredient = db.model('Ingredient', IngredientSchema),
        Recipe = db.model('Recipe', RecipeSchema),
        Recipes = db.model('Recipes', RecipesSchema);
});
// Controllers

app.get('/api', function (req, res) {
    res.send('Status: running, version 0.0.1');
});

// Launch server

app.listen(4242);
