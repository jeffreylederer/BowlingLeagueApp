import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import useLeague from "@hooks/useLeague";
import useLogin from "@hooks/useLogin";

function Logoff() {
    const navigate = useNavigate();
    
   

    useEffect(() => {
        useLogin.getState().initialize();   
        useLeague.getState().initialize();
        navigate("/Login");
    }, [navigate ]);
    return (
        <></>
    );
}


export default Logoff