import React, { PropsWithChildren, useMemo, useState, MouseEvent } from "react"
import ReactPaginate from "react-paginate"

type PaginatorProp = {
    data: any[]
    itemsPerPage: number
    pageCount: number
    intialPage?: number
    handlePageClick: (selectedItem: {selected: number}) => void
}

export default function Paginator({data,intialPage = 0, itemsPerPage, pageCount, handlePageClick,children, ...props}: PropsWithChildren<PaginatorProp>) {
    return (
        <div className="flex flex-col gap-y-10">
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
            <div className="flex w-full justify-center h-fit">
                <ReactPaginate
                initialPage={intialPage}
                    breakLabel="..."
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="< Prev."
                    renderOnZeroPageCount={null}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                    activeClassName={'active'}
                />
            </div>
        </div>
    )
}