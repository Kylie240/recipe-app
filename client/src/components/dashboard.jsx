import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserID } from '../hooks/getUserID';


export const Dashboard = (props) => {
    const nav = useNavigate();
    const userID = getUserID()

    const [cookies, setCookies] = useCookies(["acces_token"])
    const [shoppingList, setShoppingList] = useState([])
    const [showShoppingList, setShowShoppingList] = useState(false)

    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await axios.get(`https://smoothie-queen.onrender.com/shoppingList/${userID}`)
                setShoppingList(response.data)
            } catch (err) {
                console.error(err);
            }
        }
        fetchList()
    },[props.updateList])

    const handleLogout = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userID");
        window.localStorage.removeItem("username");
        nav("/")
    }

    const handleDelete = async (index) => {
        try {
            const res = await axios.put("https://smoothie-queen.onrender.com/shoppinglist", {index, userID})
            setShoppingList(res.data.shoppingList);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClearAll = async () => {
        try {
            const res = await axios.put("https://smoothie-queen.onrender.com/shoppinglist/clear", {userID})
            setShoppingList(res.data.shoppingList);
        } catch (error) {
            console.log(error);
        }
    }

    function handleModal () {
        setShowShoppingList(!showShoppingList)
        console.log(showShoppingList);
    }

    return (
        <div className='flex-col gap-4'>
            <div className="flex items-center justify-around relative rounded-2xl p-4 border-2 border-grey-100">
                <Link to={"/create-recipe"} className='pr-2 border-r flex items-center gap-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    <h6 className='text-lg flex'>Create<span className='hidden md:flex md:pl-[6px]'> a recipe</span></h6>
                </Link>
                <button 
                    onClick={handleModal}
                    className='px-2 border-r flex items-center gap-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <h6 className='text-lg hidden md:flex'>Shopping list</h6>
                    <h6 className='text-lg flex md:hidden'>List</h6>
                    { showShoppingList ?
                        (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="top-1 ml-1 w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>) 
                      :
                        (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="top-1 ml-1 w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>)
                      
                    }
                </button>
                <div>
                    <Link onClick={handleLogout} to={"/login"} className='pl-3 rounded-lg p-1 text-lg'>
                        Logout
                    </Link>
                </div>
            </div>
            { showShoppingList &&
                <div className='flex flex-col items-center justify-around relative rounded-2xl w-auto p-4 border border-grey-100'>
                    <h6 className='px-4 m-2 text-3xl font-bold uppercase border-b-4 border-dotted border-violet-300'>Shopping List :</h6>
                    <ul className='flex flex-col'>
                        { shoppingList.map((item, index) => (
                            <li key={index} className='hover:font-medium flex items-center justify-between my-1'>
                                <p className='text-lg pr-4'>
                                    - {item} 
                                </p>
                                <button onClick={() => handleDelete(index)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-gray-500 hover:fill-violet-300 w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                    { shoppingList.length > 0 ? 
                        <button className='hover:font-medium mt-4 border-t-2 border-gray-300 outline-none' onClick={handleClearAll}>clear all</button>
                    : "nothing to see yet"}
                </div>
                }
        </div>
    )
}