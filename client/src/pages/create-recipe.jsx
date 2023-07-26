import { useEffect, useState } from "react"
import { Benefits } from './benefits';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserID } from "../hooks/getUserID";
import { getUsername } from "../hooks/getUsername";


export const CreateRecipe = () => {
    const [benefits,setBenefits] = useState("")
    const [recipe, setRecipe] = useState({
        name: "",
        description: "",
        calories: "",
        servings: "",
        benefits: [],
        ingredients: [""],
        imageUrl: "",
        createdBy: "",
    })

    const nav = useNavigate();
    const userID = getUserID();
    const username = getUsername();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setRecipe({...recipe, [name]: value})
    }

    const handleIngredientChange = (e, index) => {
        const {value} = e.target;
        const ingredients = recipe.ingredients;
        ingredients[index] = value;
        setRecipe({...recipe, ingredients: ingredients})
    }

    const handleIngredientDelete = (e, index) => {
        console.log(recipe.ingredients);
        recipe.ingredients.splice(index, 1)
    }

    const handleAddIngredient = () => {
        const ingredients = [...recipe.ingredients, ""];
        setRecipe({...recipe, ingredients })
    }

    const submitRecipe = async (e) => {
        e.preventDefault()
        recipe.createdBy = username
        recipe.benefits = benefits
        try {
            const res = await axios.post("http://localhost:3000/recipes/create-recipe", {recipe, userID})
            alert(`${recipe.name} recipe created successfully!`);
            nav('/')
        } catch (err) {
            console.error(err)
        }
    }

    console.log(recipe.ingredients);

    return (
        <div className="relative mb-44 top-28 md:mx-20 lg:mx-32">
            <h2 className="text-blue-950 uppercase text-center text-4xl font-bold mb-8"> Create A Recipe </h2>
            <form className="m-8" onSubmit={submitRecipe}>
                <label htmlFor="name">Name *</label>
                <input 
                    required
                    type="text"
                    id="name"
                    name="name"
                    placeholder="create a name for your creation"
                    value={recipe.name}
                    onChange={handleChange}
                 />
                <label htmlFor="imageUrl">Upload an image *</label>
                <input 
                    required
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    placeholder="show other users what your recipe looks like"
                    value={recipe.imageUrl}
                    onChange={handleChange}
                 />
                <label htmlFor="description">Description *</label>
                <input 
                    required
                    type="text"
                    id="description"
                    name="description"
                    value={recipe.description}
                    onChange={handleChange}
                 />
                <label htmlFor="ingredients">Ingredients *</label>
                <div className="grid md:gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {recipe.ingredients.map((ingredient, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-center">
                                <input 
                                    required
                                    key={index}
                                    type="text"
                                    name="ingredients"
                                    value={ingredient}
                                    onChange={(e) => handleIngredientChange(e, index)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleAddIngredient} type="button">Add Ingredient</button>
                <br />
                <div className="gap-4 grid grid-cols-2">
                    <div>
                        <label htmlFor="calories">Calories</label>
                        <input 
                            type="text"
                            id="calories"
                            name="calories"
                            placeholder="120"
                            value={recipe.calories}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="servings">Serving Size</label>
                        <input 
                            type="text"
                            id="servings"
                            name="servings"
                            placeholder="1 serving"
                            value={recipe.servings}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <label  htmlFor="benefits">Benefits</label>
                <Benefits selected={benefits} onChange={setBenefits} />
                <br />
                <button type="submit">Create Recipe</button>
            </form>
        </div>
    )
}