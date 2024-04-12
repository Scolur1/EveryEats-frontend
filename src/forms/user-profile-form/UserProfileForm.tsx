import { useForm } from "react-hook-form";
import { z } from "zod";
import{ zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { useEffect } from "react";

//specify all the properties our form has
const formSchema = z.object({
  email: z.string().optional(), //optional b/c read-only field anyway
  name: z.string().min(1, {message: "Name is required"}), //spaces and empty string caught by this line as well
  addressLine1: z.string().min(1, {message: "Address Line 1 is required"}),
  city: z.string().min(1, {message: "City is required"}),
  country: z.string().min(1, {message: "Country is required"}),
})

//define type to have better access through intellisense
type UserFormData = z.infer<typeof formSchema>; //zod framework to auto infer type based on form schema

type Props = {
  currentUser: User;
  //accepts user profile data from form. 
  //Passing onSave as prop means we can do all the api stuff at the page level
  onSave: (userProfileData: UserFormData) => void;
  isLoading: boolean;
}

const UserProfileForm = ({onSave, isLoading, currentUser}: Props) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: currentUser,
  });

  //if the component rerenders and if current user changes, 
  //will call reset fx on the form which causes form to rerender 
  //based on the new data passed to the reset function, 
  //in this case the current user  
  useEffect(()=>{
    form.reset(currentUser)
  }, [currentUser, form]);

  return(
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSave)} 
        className="space-y-4 bg-gray-50 rounded-lg md:p-10"
      >
        <div>
          <h2 className="text-2xl font-bold">User Profile Form</h2>
          <FormDescription>
            View and change your profile information here
          </FormDescription>
        </div>
        <FormField 
          control={form.control} 
          name="email"
          render={({field}) =>(
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-white" />
              </FormControl>
            </FormItem>
          )}/>
        <FormField 
          control={form.control} 
          name="name"
          render={({field}) =>(
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white" />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <FormField 
            control={form.control} 
            name="addressLine1"
            render={({field}) =>(
              <FormItem className="flex-1">
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField 
            control={form.control} 
            name="city"
            render={({field}) =>(
              <FormItem className="flex-1">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField 
            control={form.control} 
            name="country"
            render={({field}) =>(
              <FormItem className="flex-1">
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>
        {isLoading ? (
          <LoadingButton/> 
        ):(
          <Button type="submit" className="bg-orange-500">Submit</Button>
        )}
      </form>
    </Form>
  )
}

export default UserProfileForm;