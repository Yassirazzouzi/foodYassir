// import { food_list} from "../assets/assets";

import React, { useEffect, useState } from "react";


export const StoreContext = React.createContext(null );

const StoreContextProvider = (props) => {
const url='http://localhost:4000'
const [food_list, setFoodList] = useState([])

const fetchFoodList = async () => {
    try {
        const response = await fetch(url+"/api/foods/all");
        const data = await response.json();
        setFoodList(data.foods);
    } catch (error) {
        console.error("Error fetching food list:", error);
    }
}









useEffect(() => {
    
    
    async function loadData() 
    {
        await fetchFoodList()
        if (localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
        }
    }
    loadData()
}, []);

const [token, setToken]= useState('')
    const contextValue={
                food_list,
                url,
                token,
                setToken
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;