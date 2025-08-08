import { createContext, useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext()

const UserDataContext = ({ children }) => {
    const [user, setUser] = useState('')

    const [ captain, setCaptain ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    };

    const value = {
        user,
        setUser,
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain
    };
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default UserDataContext
