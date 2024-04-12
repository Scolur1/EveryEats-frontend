import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
  const {currentUser, isLoading: isGetLoading} = useGetMyUser();
  //destructure updateUser function and isLoading
  const {updateUser, isLoading: isUpdateLoading} = useUpdateMyUser();
  
  //while getMyUser request is happening will return loading text.
  //means form will be displayed once there is data to display
  if(isGetLoading){
    return <span>Loading...</span>;
  }

  if(!currentUser){
    return <span>Unable to load user profile</span>;
  }

  return(
    <UserProfileForm 
      currentUser={currentUser}
      onSave={updateUser} 
      isLoading={isUpdateLoading}
    />
  )
}

export default UserProfilePage;