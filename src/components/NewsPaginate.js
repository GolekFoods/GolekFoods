import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import dummyNews from "../data/DummyNews";

function Items({ currentItems }) {
    return (
        <>
            {currentItems && currentItems.map((item) => (
                <>
                    {item}
                </>
            ))}
        </>
    );
}

function NewsPaginate({ newsItemsPerPage }) {
    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + newsItemsPerPage;
    const currentItems = dummyNews.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(dummyNews.length / newsItemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * newsItemsPerPage) % dummyNews.length;
        setItemOffset(newOffset);
    }

    return (
        <>
            <Items currentItems={currentItems} />
            <ReactPaginate
                breakAriaLabels="..."
                nextLabel="Next"
                nextClassName="hover:font-semibold"
                onPageChange={handlePageClick}
                activeClassName="border border-black px-4 py-2 rounded-lg"
                pageRangeDisplayed={5}
                pageCount={pageCount}
                pageClassName="hover:font-semibold"
                previousLabel="Prev"
                previousClassName="hover:font-semibold"
                renderOnZeroPageCount={null}
                className="flex space-x-10 items-center"
            />
        </>
    );
}

export default NewsPaginate;