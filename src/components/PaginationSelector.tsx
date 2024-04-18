import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

type Props = {
  page: number; //page user selects
  pages: number; //number of pages
  onPageChange: (page: number)=> void //anytime page number changes this gets called
}

const PaginationSelector = ({page, pages, onPageChange}: Props) => {
  const pageNumbers = [];
  for(let i = 1; i <= pages; i++){
    pageNumbers.push(i);
  }

  return(
    <Pagination>
      <PaginationContent>
        {page !== 1 && (
          <PaginationItem>
            <PaginationPrevious href="#" onClick={()=> onPageChange(page - 1)}/>
          </PaginationItem>
        )}

        {pageNumbers.map((number)=> (
          <PaginationItem>
            <PaginationLink 
              href="#" 
              onClick={() => onPageChange(number)} 
              isActive={page === number}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}

        {(page !== pageNumbers.length && pages > 0) && (
          <PaginationItem>
            <PaginationNext href="#" onClick={() => onPageChange(page + 1)}/>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationSelector;