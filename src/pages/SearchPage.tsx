import { useSearchRestaurants } from "@/api/RestaurantApi";
import CuisineFilter from "@/components/CuisineFilter";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import SearchResultCard from "@/components/SearchResultCard";
import SearchResultInfo from "@/components/SearchResultInfo";
import SortOptionDropdown from "@/components/SortOptionDropdown";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export type SearchState = {
  searchQuery: string;
  page: number;
  selectedCuisines: string[];
  sortOption: string;
}
const SearchPage = () => {
  const {city} = useParams();
  const navigate = useNavigate();
 
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: "",
    page: 1,
    selectedCuisines: [],
    sortOption: "bestMatch",
  })

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const {results, isLoading} = useSearchRestaurants(searchState, city);

  const setSortOptions = (sortOption: string) => {
    setSearchState((prevState)=> ({
      ...prevState,
      sortOption,
      page: 1,
    }))
  }
  
  const setSelectedCuisines = (selectedCuisines: string[]) => {
    setSearchState((prevState)=> ({
      ...prevState,
      selectedCuisines,
      page: 1,
    }))
  }

  const setPage = (page: number) => {
    setSearchState((prevState)=> ({
      ...prevState,
      page //page: page
    }))
  }

  const setSearchQuery = (searchFormData: SearchForm) => {
    //update searchState with new search value
    setSearchState((prevState)=> ({
      //copy prev state
      ...prevState,
      searchQuery:searchFormData.searchQuery,
      page: 1,
    }));
  };

  const resetSearch = () => {
    setSearchState((prevState)=> ({
      //copy prev state
      ...prevState,
      searchQuery: "",
      page: 1,
    }));
  }
  if(isLoading){
   return (
      <span>
        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
        Loading...
      </span>
    )
  }

  if(!results?.data || !city){
    return (
      <div className="flex flex-col justify-center items-center gap-3">
        <span className="text-xl font-bold">No results for entry</span>
        <Button 
          onClick={() => navigate("/")}
          className="bg-orange-500"
        >
          Back to Home
        </Button>
      </div> 
    )
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div id="cuisines-list">
        <CuisineFilter 
          selectedCuisines={searchState.selectedCuisines}
          onChange={setSelectedCuisines}
          isExpanded={isExpanded}
          onExpandedClick={()=> 
            setIsExpanded((prevIsExpanded)=> !prevIsExpanded)
          }
        />
      </div>
      <div id="main-content" className="flex flex-col gap-5">
        <SearchBar
          searchQuery={searchState.searchQuery} 
          onSubmit={setSearchQuery} 
          placeHolder="Search by Cuisine or Restaurant Name"
          onReset={resetSearch}
        />
        <div className="flex justify-between flex-col gap-3 lg:flex-row">
          <SearchResultInfo total={results.pagination.total} city={city} />
          <SortOptionDropdown 
            sortOption={searchState.sortOption} 
            onChange={(value)=> setSortOptions(value)}
          />
        </div>
        {results.data.map((restaurant)=> (
          <SearchResultCard restaurant={restaurant} key={restaurant.restaurantName}/>
        ))}
        <PaginationSelector 
          page={results.pagination.page} 
          pages={results.pagination.pages}
          onPageChange={setPage}
        ></PaginationSelector>
      </div>
    </div>
  )
}

export default SearchPage;