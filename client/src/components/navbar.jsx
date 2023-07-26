import { Link } from "react-router-dom"
import {useCookies} from 'react-cookie'
import { useState } from "react"
import { getUsername } from "../hooks/getUsername"

export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"])
    const [searchValue, setSearchValue] = useState("");

    const username = getUsername();
 
    return (
        <div className="flex justify-center">
             <div className="fixed z-30 w-screen lg:w-1/2 top-0 flex justify-between items-center px-4 md:px-8 lg:px-12 py-3 bg-white border rounded-b-2xl border-grey-300">
                <Link to={"/"} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path  strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    <span className="font-bold text-2xl" >smoothie queen</span>
                </Link>
                <div className="border border-gray-400 p-1 rounded-2xl flex flex-row items-center gap-4">
                    {cookies.access_token ? 
                        ( <div className="flex gap-2">
                            <Link 
                                className="flex gap-2 md:mr-1" 
                                to={"/account"}
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="solid" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg> 
                                <span className="hidden md:flex -mr-6 md:mr-0">{username}</span>
                            </Link> 
                        </div> )
                        :  
                        (<div className="flex gap-2">
                            <Link className="flex gap-2 mr-1" to={"/login"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg> <span className="hidden md:flex -mr-6 md:mr-0">login</span>
                            </Link> 
                        </div>)
                    }
                </div>
            </div>
        </div>
    )
}