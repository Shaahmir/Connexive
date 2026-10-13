import { createContext, useContext, useState } from "react";
import {useNavigate} from 'react-router-dom';
import httpStatus from "http-status";
import axios from 'axios';

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `http://localhost:8080/api/v1/user`,
});

export const AuthProvider = ({children}) => {

    const router = useNavigate();
    const authProvider = useContext(AuthContext);
    const [userData, setUserData] = useState(authProvider);

    const handleRegister = async (name, username, password) => {
        try {
            const result = await client.post("/register", {
                name,
                username,
                password
            });

            if (result.status == httpStatus.CREATED) {
                return result;
            }

        } catch(e) {
           throw e;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let result = await client.post("/login", {
                username,
                password
            });

            if (result.status == httpStatus.OK) {
                localStorage.setItem("token", result.data.token);
                router("/");
                return result;
            }

        } catch(e) {
            throw e;
        }
    }

    const handleGetHistory = async () => {
        try {
            let result = await client.get('/getHistory', {
                params: {
                    token: localStorage.getItem("token")
                }
            })

            return result.data;

        } catch (e) {
            throw e;
        }
    }

    const handleSetHistory = async (meetingCode) => {
        try {
            let result = await client.post('/setHistory', {
                meetingCode,
                token: localStorage.getItem("token")
            })
            
        } catch(e) {
            console.log(e)
        }
    }

    const data = {
        userData, 
        setUserData, 
        handleLogin,
        handleRegister, 
        handleGetHistory,
        handleSetHistory
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
    
}