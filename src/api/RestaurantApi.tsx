import { SearchState } from "@/pages/SearchPage";
import { RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSearchRestaurants = (
  searchState:SearchState, //all search options user selected
  city?: string
) => {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    params.set("sortOption", searchState.sortOption);

    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`
    );

    if(!response.ok){
      throw new Error("Failed to get restaurant");
    }

    return response.json();
  };

  const{data: results, isLoading} = useQuery(
    ["searchRestaurants", searchState],//name of the query
    createSearchRequest,
    {enabled: !!city} //query wont run w/o truthy string value for city arg. undefined wont run
  );

  return{
    results,
    isLoading
  };
};