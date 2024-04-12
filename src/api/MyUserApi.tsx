import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyUser = () => {
  const {getAccessTokenSilently} = useAuth0();

  const getMyUserRequest = async () : Promise<User> => {
    const accessToken = await getAccessTokenSilently();
    
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "GET",
      headers:{
        Authorization: `Bearer ${accessToken}`,  
        //tells our backend server what type to expect in the body of req
        "Content-Type": "application/json"
      },
    });

    if(!response.ok){
      throw new Error("Failed to fetch user");
    }
    //getMyUser request is going to return the user object as part of body of res
    return response.json();
  };
  //destructure what we get back from useQuery hook. useQuery here b/c we want to fetch data
  const { 
    data: currentUser, 
    isLoading, 
    error} = useQuery("fetchCurrentUser", getMyUserRequest);

  if(error){
    toast.error(error.toString());
  }

  //return data and isLoading state so our components have access to it
  return {currentUser, isLoading};
};

type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

export const useCreateMyUser = () => {
  const {getAccessTokenSilently} = useAuth0(); //function lets us fetch auth token from auth0 server 

  //Makes a POST request to our backend that is going to create the user in MongoDB
  //create the fetch request
  const createMyUserRequest = async (user: CreateUserRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/user`,{
      //set of options that we want to pass to the fetch request
      method: "POST",
      headers:{
        Authorization: `Bearer ${accessToken}`,  
        //tells our backend server what type to expect in the body of req
        "Content-Type": "application/json"
      },
      //pass the body
      body: JSON.stringify(user)
    });
    //check res was okay or throw error
    if(!response.ok){
      throw new Error("Failed to create user");
    }
  };
  //pass fetch request to use mutation hook from React Query that will manage req for us
  const { 
    mutateAsync: createUser, //renaming fx to call this fx to createUser 
    isLoading, 
    isError, 
    isSuccess,
  } = useMutation(createMyUserRequest);

  //return useMutation hook functionality from our useCreateMyUser hook 
  //so that components can get access to them
  return{
    createUser,
    isLoading,
    isError,
    isSuccess,
  };
};


type UpdateMyUserRequest = {
  name: string,
  addressLine1: string,
  city: string,
  country: string,
}
export const useUpdateMyUser = () => {
  //get access token
  const {getAccessTokenSilently} = useAuth0();

  //create fetch request function. Going to accept data from user profile form
  const updateMyUserRequest = async (formData: UpdateMyUserRequest) =>{
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/user`,{
      //set of options that we want to pass to the fetch request
      method: "PUT",
      headers:{
        Authorization: `Bearer ${accessToken}`,  
        //tells our backend server what type to expect in the body of req
        "Content-Type": "application/json"
      },
      //pass the body
      body: JSON.stringify(formData)
    });
    //check res was okay or throw error
    if(!response.ok){
      throw new Error("Failed to create user");
    }
  };

  //pass fetch request to use mutation hook from React Query that will manage req for us
  const { 
    mutateAsync: updateUser, //renaming fx to call this fx to updateUser 
    isLoading, 
    isSuccess,
    error,
    reset
  } = useMutation(updateMyUserRequest);

  //check useMutation hook isSuccess
  if(isSuccess){
    toast.success("User profile updated!");
  }
  //check useMutation hook error
  if(error){
    toast.error(error.toString());
    reset();//clears error state from this request
  }

  //return useMutation hook functionality from our useUpdateMyUser hook 
  //so that components can get access to them
  return{
    updateUser,
    isLoading,
  };

};