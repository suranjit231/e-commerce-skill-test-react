import { createContext, useState, useContext } from "react";

// Create the context
const NavbarContext = createContext();

// Navbar context provider
export function NavbarProvider({ children }) {
    const [isSearchBar, setSearchBar] = useState(false);
    const [isUserProfileBar, setIsUserProfilebar] = useState(false);
    const [isShowFiltered, setIsFilteredDiv] = useState(false);

    // Function to toggle the user profile sidebar
    function toggleUserProfileBar() {
        setIsUserProfilebar((prev) => !prev);
        if(isSearchBar){
            setSearchBar(false);
        }

        if(isShowFiltered){
            setIsFilteredDiv(false);
        }
    }

    //==== function toggle search bar =========//
    function toggleSearchbar(){
        setSearchBar((prev)=>!prev);
        if(isUserProfileBar){
            setIsUserProfilebar(false);
        }

        if(isShowFiltered){
            setIsFilteredDiv(false);
        }

       
    }

    //===== toogle filter container for responsive ====//
    function toggleFilteredDiv(){
        setIsFilteredDiv((prev)=>!prev);
        if(isUserProfileBar){
            setIsUserProfilebar(false);
        }
        if(isSearchBar){
            setSearchBar(false);
        }

    }

    return (
        <NavbarContext.Provider value={{ 
            isSearchBar, 
            toggleSearchbar, 

            isUserProfileBar, 
            toggleUserProfileBar,
            isShowFiltered,
            toggleFilteredDiv 
        }}>
            {children}
        </NavbarContext.Provider>
    );
}

// Custom hook to use the Navbar context
export function useNavbar() {
    return useContext(NavbarContext);
}
