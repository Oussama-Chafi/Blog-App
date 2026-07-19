import { useEffect, useState } from "react"
import { useSelector , useDispatch } from "react-redux"
import { useRefreshMutation } from "../redux-toolkit/features/auth/authApiSlice"
import { Navigate, Outlet,  } from "react-router-dom"
import { setCredentials } from "../redux-toolkit/features/auth/authSlice"


const PerisistLogin =  () =>{
    //CHECK IF WE HAVE A TOKEN IN THE AUTH SLICE 
    const token = useSelector(state => state.auth.token)
    // CALL REFRESH HOOK FROM AUTH API SLICE 
    const [refresh , {isError} ] = useRefreshMutation()
    // 
    const [loading , setLoading] = useState(true)
    // CALL USE DISPATCH TO HANDL THE STATE
    const dispatch = useDispatch()
    // USING USEEFFECT TO START THIS FUNCTION AFTER RELOADNIG DIREKT
    useEffect(() =>{

        // CREATE AN ASYNC FUNCTION TO CALL API AND GET A NEW TOKEN
        const verifyRefreshToken = async () =>{

            try {
                //GET THE DATA FROM THIS API 
                const data = await refresh().unwrap();
                // HANDEL THIS KEYS AFTER GET THE DATA AND THIS IS THE IMPORTANT THING IN THIS CODE
                dispatch(setCredentials({
                    user : data.user,
                    token : data.accessToken,
                }))
            } catch (error) {
                console.log(error)
                
            }
             // CHANGE THE VALUE OF THE STATE ...
             finally{
                setLoading(false)
            }
        }
        // CHECK IF WE HAVE A TOKEN AND HE ALL WAYS IS NOT IF WE CHANGE THE PAGE OR AFTER RELOADING
        if(!token) {
            // RUN THIS FUNCTION
            verifyRefreshToken()
        }else{
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(false)
        }
    } ,[token , dispatch, refresh])
    
    if(loading) return ( <p className="text-3xl flex justify-center mt-100">Loading ...</p>)
    if(isError){
        <Navigate to={"/auth/login"} replace />
    }
    return <Outlet/>
}


export default PerisistLogin