import express from 'express'
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { UserModel } from './models/Users.js';
import { RecipeModel } from './models/Recipe.js';
import jwt from 'jsonwebtoken';
import ObjectId from "mongodb";

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://olivkylie:GFOtJ6BKdm7ovIWE@cluster0.wikcpbd.mongodb.net/Cluster0?retryWrites=true&w=majority")


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, "secret", (err) => {
            if (err) return res.ssendStatus(403)
            next()
        })
    } else {
        res.sendStatus(401)
    }
}

//user
app.post("/register", async (req, res) => {  
    const {username, email, password} = req.body;
    const user = await UserModel.findOne({username})
    const userEmail = await UserModel.findOne({email})

    if (user) {
        return res.json({message: "User already exists"})
    } 
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({username, email, password:hashedPassword})
    await newUser.save()
    
    res.json({message: "User registered successfully!"})
})

app.post("/login", async (req, res) => {  
    const {email, password} = req.body;
    try{
        const user = await UserModel.findOne({email})
    
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.json({message: "Username or password is incorrect"})
    }
    
    const token = jwt.sign({id: user._id}, "secret");
    res.json({token, userID: user._id, username: user.username})
    
} catch (err) {
    return res.json({message: "Error logging in"})
}

})


//recipes
app.get('/', async (req, res) => { 
    try {
        const response = await RecipeModel.find({})
        res.json(response)
    } catch (err) {
        res.json(err);
    }
})

app.put('/', async (req, res) => {
    try {
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.push(recipe);
        await user.save();
        res.json({ savedRecipes: user.savedRecipes});
    } catch (err) {
        res.json(err)
    }
})

app.post("/recipes/create-recipe", async (req, res) => { 
    const recipe = new RecipeModel(req.body.recipe);
    try {
        await recipe.save();
        res.json({message: "recipe created"})
    } catch (err) {
        res.json(err);
    }
})


app.get("/recipes/:recipeID", async (req, res) => { 
    try {
        const recipe = await RecipeModel.findById(req.params.recipeID)
        res.json(recipe)
    } catch (err) {
        res.json(err);
    }
})

app.get("/savedRecipes/ids/:userID", async (req, res) => { 
    try {
        const user = await UserModel.findById(req.params.userID)
        res.json({ savedRecipes: user?.savedRecipes})
    } catch (err) {
        res.json(err);
    }
})
app.get("/savedRecipes/:userID", async (req, res) => { 
    try {
        const user = await UserModel.findById(req.params.userID)
        const savedRecipes = await RecipeModel.find({
            _id: { $in: user.savedRecipes }
        })
        res.json({savedRecipes})
    } catch (err) {
        res.json(err);
    }
})
app.put("/shoppingList", async (req, res) => { 
    try {
        const user = await UserModel.findById(req.body.userID)
        const i = req.body.index
        const shoppingList = user.shoppingList
        shoppingList.splice(i, 1)
        user.shoppingList = shoppingList
        await user.save()
        res.json({shoppingList : user.shoppingList})
    } catch (err) {
        res.json(err);
    }
})
app.get("/shoppingList/:userID", async (req, res) => { 
    try {
        const user = await UserModel.findById(req.params.userID)
        const shoppingList = user?.shoppingList
        res.json(shoppingList)
    } catch (err) {
        res.json(err);
    }
})

app.put("/shoppingList/add", async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.userID)
        const recipe = await RecipeModel.findById(req.body.recipeID)
        const index = req.body.index

        const isSaved = user.shoppingList.includes(req.body.ingredient)
        if (isSaved) {
            return res.json({message: "item already added"})
        } else {
            user.shoppingList.push([recipe.ingredients[index]][0]);
            await user.save();
            res.json({ shoppingList: user.shoppingList});
        }
    } catch (err) {
        res.json(err)
    }
})
app.put("/shoppingList/clear", async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.userID)
        user.shoppingList = ([])
        await user.save();
        res.json({ shoppingList: user.shoppingList});
    } catch (err) {
        res.json(err)
    }
})


app.listen(3000, () => console.log("server started"))