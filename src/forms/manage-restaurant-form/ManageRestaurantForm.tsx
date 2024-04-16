import { useForm } from "react-hook-form";
import{ zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types";
import { useEffect } from "react";

const formSchema = z.object({
  restaurantName: z.string({
    required_error: "Restaurant name is required",
  }), 
  city: z.string({
    required_error: "City name is required",
  }),
  country: z.string({
    required_error: "Country name is required",
  }),
  deliveryPrice: z.coerce.number({
    required_error: "Delivery price must be greater than 0",
    invalid_type_error: "Must be a valid number",
  }),
  estimatedDeliveryTime: z.coerce.number({
    required_error: "Estimated delivery time must be greater than 0",
    invalid_type_error: "Must be a valid number",
  }),
  cuisines: z.array(z.string()).min(1, {message: "Please select at least one item"}),
  menuItems:z.array(z.object({
    name: z.string().min(1, {message: "Name is required"}),
    price: z.coerce.number({
      required_error: "Price must be greater than 0",
      invalid_type_error: "Must be a valid number",
    }),
  })),
  imageUrl: z.string().optional(),
  imageFile: z.instanceof(File, {message: "image is required"}).optional(),
})
.refine((data)=> data.imageUrl || data.imageFile, {
  message:"Either image URL or image File must be provided",
  path: ["imageFile"],
});

type RestaurantFormData = z.infer<typeof formSchema>

type Props = {
  restaurant?: Restaurant;
  onSave:(restaurantFormData: FormData) => void;
  isLoading: boolean;
}

const ManageRestaurantForm = ({onSave, isLoading, restaurant}: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues:{
      cuisines:[],
      menuItems:[{name: "", price: 0}],
    },
  });

  useEffect(() => {
    if(!restaurant){
      return;
    }

    //format data in restaurant to match what our form expects
    const deliveryPriceFormatted = parseInt(
      (restaurant.deliveryPrice/100).toFixed(2)
    );

    const menuItemsFormatted = restaurant.menuItems.map((item)=>({
      ...item, //copy of current item
      price: parseInt((item.price/100).toFixed(2)),
    }));

    const updatedRestaurant = {
      ...restaurant, //copy existing properties from the restaurant
      deliveryPrice: deliveryPriceFormatted,
      menuItems: menuItemsFormatted,
    }

    form.reset(updatedRestaurant)
  }, [form, restaurant]);
  
  const onSubmit = (formDataJson: RestaurantFormData) => {
    //convert formDataJson to a new FormData object
    const formData = new FormData();

    formData.append("restaurantName", formDataJson.restaurantName);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    
    formData.append(
      "deliveryPrice", 
      (formDataJson.deliveryPrice * 100).toString()
    );
    formData.append(
      "estimatedDeliveryTime", 
      formDataJson.estimatedDeliveryTime.toString()
    );
    formDataJson.cuisines.forEach((cuisine, index)=> {
      formData.append(`cuisines[${index}]`, cuisine);
    });
    formDataJson.menuItems.forEach((menuItem, index)=>{
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(
        `menuItems[${index}][price]`, 
        (menuItem.price * 100).toString()
      );
    });

    if(formDataJson.imageFile){
      formData.append(`imageFile`, formDataJson.imageFile);
    }

    onSave(formData);
  };

  return(
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection/>
        <Separator/>
        <CuisinesSection/>
        <Separator/>
        <MenuSection/>
        <Separator/>
        <ImageSection/>
        {isLoading ? <LoadingButton/> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  )
}

export default ManageRestaurantForm;