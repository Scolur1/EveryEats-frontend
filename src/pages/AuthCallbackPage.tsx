import { useCreateMyUser } from "@/api/MyUserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const {user} = useAuth0(); //gives access to current logged in user
  const {createUser} = useCreateMyUser();
  const hasCreatedUser = useRef(false); 

  //whenever the component loads we want to create the user
  useEffect(() => {
    if(user?.sub && user?.email && !hasCreatedUser.current){
      //initialize call to backend
      createUser({
          auth0Id: user.sub, //.sub is auth0Id 
          email: user.email
        });
      hasCreatedUser.current = true;  
    }
    //navigate away from callback page to homepage
    navigate("/")
  }, [createUser,navigate, user]);

  return <>Loading...</>;
}

export default AuthCallbackPage;