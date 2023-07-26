import mongoose from 'mongoose'

const RecipeSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    calories: {type: Number},
    servings: {type: Number},
    ingredients: [{type: String, required:true}],
    benefits: [{type: String}],
    imageUrl: {type: String, required:true},
    createdBy: {type: String}
})

export const RecipeModel = mongoose.model("recipes", RecipeSchema)