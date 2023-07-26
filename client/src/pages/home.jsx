import axios from "axios"
import { useEffect, useState } from "react"
import { Hero } from '../components/hero'
import { useCookies } from 'react-cookie';
import { getUserID } from "../hooks/getUserID";
import { Benefits } from './benefits';
import { TopBanner } from "../components/top-banner";

export const Home = () => {
     const [recipes, setRecipes] = useState([]);
     const [savedRecipes, setSavedRecipes] = useState([]);
     const [selectedRecipe, setSelectedRecipe] = useState({});
     const [updateList, setUpdateList] = useState(false);
     const [cookies, _] = useCookies(["access_token"])
     const userID = getUserID();

    useEffect(() => {
        window.scrollTo(0,0)
        const fetchRecipes = async () => {
            try {
                const response = await axios.get("https://smoothie-queen.onrender.com/")
                setRecipes(response.data)
            } catch (err) {
                console.error(err);
            }
        }
        const fetchSavedRecipes = async () => {
            try {
                const response = await axios.get(`https://smoothie-queen.onrender.com/savedRecipes/ids/${userID}`)
                setSavedRecipes(response.data.savedRecipes)
            } catch (err) {
                console.error(err);
            }
        }
        fetchRecipes();
        if (cookies.access_token) fetchSavedRecipes();
    }, []);

    const saveRecipe = async (recipeID) => {
        try {
            if (!userID) {
                alert('Must login to start saving recipes')
            }
            const res = await axios.put("https://smoothie-queen.onrender.com/", {recipeID, userID}, {
                headers: { authorization: "test" }
            })
            setSavedRecipes(res.data.savedRecipes);
        } catch (err) {
            console.error(err);
        }
    }

    const viewRecipe = async (recipeID) => {
        try {
            const res = await axios.get(`https://smoothie-queen.onrender.com/recipes/${recipeID}`)
            setSelectedRecipe(res.data);
        } catch (err) {
            console.error(err);
        }
    }
    
    const addToShoppingList = async (recipeID, index, ingredient) => {
        try {
            const res = await axios.put("https://smoothie-queen.onrender.com/shoppinglist/add", {recipeID, index, ingredient, userID})
            if (res.data.message === "item already added") {
                return alert(res.data.message);
            }
            setUpdateList(!updateList);
        } catch (err) {
            console.error(err);
        }
    }

    function closeModal () {
        setSelectedRecipe({})
    }

    const isSaved = (recipeID) => savedRecipes.includes(recipeID)

    return (
        <div className="flex flex-col justify-center overflow-hidden"> 
            <Hero />
            <h1 className="text-3xl lg:text-4xl font-bold text-center mt-24 mb-12  text-blue-950"> 
            CHECKOUT THESE <span className="visible md:hidden"><br /></span> GREAT RECIPES! 
            </h1>

            <div className="mb-2 grid px-4 gap-3 md:gap-5 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-4 w-auto">
                {recipes.map((recipe, index) => (
                    <div className="hover:shadow-blue-950 hover:shadow-md flex flex-col justify-between items-center h-18 p-3 w-full rounded-2xl border-4 border-violet-200 " 
                        key={recipe._id}>
                            <div className="relative w-62">
                                <div className="absolute top-4 right-4">
                                    {isSaved(recipe._id) ?  
                                        (<button>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="fill-red-600 stroke-red-800 w-10 h-10">
                                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                            </svg>                                  
                                        </button>) :
                                        ( <button  onClick={() => saveRecipe(recipe._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="opacity-30 w-10 h-10">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                            </svg>
                                        </button>
                                        )
                                    }
                                </div>
                                <img src={recipe.imageUrl} alt={recipe.name} className="object-cover rounded-2xl aspect-square w-full"/>
                                <p className="flex flex-col pt-2 justify-center text-center">
                                    {recipe.calories} cals
                                </p>
                                <div className="w-auto h-auto py-2 flex justify-center overflow-hidden text-center">
                                    <h3 className="leading-10 font-bold text-xl md:text-2xl flex flex-col justify-center text-center">
                                        {recipe.name}
                                    </h3>
                                </div>
                                <p className="mb-2 flex flex-col py-2 justify-center text-center">
                                    created by: {recipe.createdBy}
                                </p>
                                <div className="line-clamp-6 w-auto h-38 mb-4 overflow-hidden whitespace-normal text-ellipsis">
                                    <p className="tracking-wide">
                                    {recipe.description}
                                    </p>
                                </div>
                            </div>
                            <div className="relative bottom-0 grid w-full md:grid-cols-2 gap-2"> 
                                <button onClick={() => saveRecipe(recipe._id)} 
                                        className="disabled:bg-blue-950 disabled:text-white disabled:opacity-90 hover:text-white hover:bg-blue-950 p-2 w-full border rounded-md border-gray-400"
                                        disabled={isSaved(recipe._id)}
                                        >
                                        {isSaved(recipe._id) ? "Saved" : "Save"}
                                </button>
                                <button onClick={() => viewRecipe(recipe._id)} type="button" className="w-full p-2 border border-gray-400 rounded-md hover:text-white hover:bg-blue-950">View Recipe</button>
                            </div>
                    </div>
                ))}

            </div>
            {selectedRecipe._id &&
            <div className="w-screen flex justify-center items-center">
                <div className="h-full overflow-scroll shadow-lg fixed w-full xl:w-3/5 top-0 p-8 md:p-6 z-50 flex flex-col items-center bg-slate-50 rounded-2xl">
                    <div className="w-full flex flex-col md:flex-row items-start justify-around">
                        <h2 className="mb-4 uppercase text-5xl md:text-6xl lg:text-7xl color-blue-950 font-bold w-3/4">{selectedRecipe.name}</h2>
                        <div className="flex flex-col h-full md:h-auto p-4 text-lg border-violet-300 border-4 border-dotted">
                            {selectedRecipe.calories ? <p> <strong>calories:</strong> {selectedRecipe.calories}  </p> : ""}
                            {selectedRecipe.servings ? <p> <strong>serves:</strong> {selectedRecipe.servings}  </p> : ""}
                            {selectedRecipe.createdBy ? (<p> <strong>creator:</strong> {selectedRecipe.createdBy} </p>) : ""}
                        </div>
                    </div>
                        <div className="text-lg mt-4 w-full">
                            <strong>Description:</strong> <br /> {selectedRecipe.description}
                        </div>
                        <div className="text-lg mt-4 w-full flex flex-col">
                            <strong>Ingredients:</strong> <br /> 
                            <div>
                                {selectedRecipe.ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex justify-between mb-4 px-4">
                                        <div className="w-full border-b-4 border-dotted border-violet-30">
                                            {ingredient}
                                        </div>
                                        {cookies.access_token && <button onClick={() => addToShoppingList(selectedRecipe._id, index, ingredient)} 
                                            className="md:w-44 flex items-center text-lg p-2 hover:bg-violet-200 bg-violet-300 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            <p className="hidden md:flex">shopping list</p>
                                        </button>}
                                    </div>
                                ))}
                            </div>
                            {selectedRecipe.benefits.length > 0 &&
                                <div className="">
                                    <strong className="text-violet-300 font-bold text-2xl">Benefits:</strong> <br />
                                    {selectedRecipe.benefits.map((item, index) => (
                                        <div key={index} >
                                            - {item}
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                            <button type="button" onClick={closeModal} className="border border-gray-900 mt-6 hover:bg-blue-950 hover:text-white rounded-md w-full md:w-2/3 lg:w-full text-lg py-2"> Close </button>
                    </div>
                    <div className="fixed w-screen top-0 h-screen opacity-80 z-40 bg-blue-100"></div>
                </div>
            }
        </div>
    )
}