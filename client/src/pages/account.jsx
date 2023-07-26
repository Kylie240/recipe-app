import axios from "axios"
import { useEffect, useState } from "react"
import { getUserID } from "../hooks/getUserID";
import { Dashboard } from "../components/dashboard";

export const Account = () => {
     const [savedRecipes, setSavedRecipes] = useState([]);
     const [selectedRecipe, setSelectedRecipe] = useState({});
     const [updateList, setUpdateList] = useState(true);

     const userID = getUserID();

    useEffect(() => {
        window.scrollTo(0,0)
        const fetchSavedRecipes = async () => {
            try {
                const response = await axios.get(`https://smoothie-queen.onrender.com/savedRecipes/${userID}`)
                setSavedRecipes(response.data.savedRecipes)
            } catch (err) {
                console.error(err);
            }
        }
        fetchSavedRecipes();
    }, [updateList]);

    const viewRecipe = async (recipeID) => {
        try {
            const res = await axios.get(`https://smoothie-queen.onrender.com/recipes/${recipeID}`)
            setSelectedRecipe(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    function closeModal () {
        setSelectedRecipe({})
    }

    const addToShoppingList = async (recipeID, index, ingredient) => {
        try {
            const res = await axios.put("https://smoothie-queen.onrender.com/shoppinglist/add", {recipeID, index, ingredient, userID})
            if (res.data.message === "item already added") {
                return alert(res.data.message);
            }
            setUpdateList(!updateList);
            console.log(updateList);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="pl-2 pr-2 mt-28 flex flex-col items-center"> 
            <Dashboard updateList={updateList}/>

            <h1 className="text-4xl font-bold text-center my-8 uppercase"> Saved Recipes </h1>
            {savedRecipes?.length < 1 && 
                    <div className="flex text-center justify-center h-screen">No recipes saved yet</div>}
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4 ">
                
                {savedRecipes.map((recipe, index) => (
                    <div className="hover:shadow-blue-950 hover:shadow-lg flex flex-col justify-between items-center h-18 p-3 w-full rounded-2xl border-4 border-violet-200" 
                        key={recipe._id}>
                            <div>
                                <div className="w-62">
                                    <img src={recipe.imageUrl} alt={recipe.name} className="object-cover rounded-2xl aspect-square w-full"/>
                                </div>
                                <p className="flex flex-col pt-2 justify-center text-center">
                                    {recipe.calories} cals
                                </p>
                                <div className="w-auto h-auto py-2 flex justify-center overflow-hidden text-center">
                                    <h3 className="leading-6 md:leading-none font-bold text-xl md:text-2xl flex flex-col justify-center text-center">
                                        {recipe.name}
                                    </h3>
                                </div>
                                <p className="mb-2 flex flex-col py-2 justify-center text-center">
                                    created by: {recipe.createdBy}
                                </p>
                                <div className="line-clamp-6 w-auto h-38 mb-2 overflow-hidden whitespace-normal text-ellipsis">
                                    <p className="tracking-wide">
                                    {recipe.description}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => viewRecipe(recipe._id)} type="button" className="w-full hover:text-white hover:bg-blue-950 p-2 border rounded-md border-gray-400">View Recipe</button>
                            
                    </div>
                ))}
            </ul>

            {selectedRecipe._id &&
            <div className="w-screen flex flex-col justify-center items-center">
                <div className="h-full overflow-scroll shadow-lg fixed w-screen xl:w-3/5 top-0 p-10 md:p-8 z-50 flex flex-col items-center bg-slate-50 rounded-2xl">
                    <div className="flex flex-col md:flex-row items-start">
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
                                {selectedRecipe.ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex justify-between mb-4">
                                        <div className="w-3/4 border-b-4 border-dotted border-violet-30">
                                            {ingredient}
                                        </div>
                                        <button onClick={(e) => addToShoppingList(selectedRecipe._id, index, ingredient)} 
                                            className="flex items-center text-lg p-2 hover:bg-violet-200 bg-violet-300 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            <p className="hidden md:flex">shopping list</p>
                                        </button>
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
                        <button type="button" onClick={closeModal} className="border border-gray-900 mt-6 hover:bg-blue-950 hover:text-white rounded-md w-full md:w-2/3 lg:w-full text-lg py-2"> Close </button>
                    </div>
                <div className="fixed w-screen top-0 h-full opacity-80 z-40 bg-blue-100"></div>
            </div>
            }
        </div>
    )
}