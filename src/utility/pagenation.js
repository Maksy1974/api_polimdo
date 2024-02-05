function pagenation(page, row) {
    page = Number(page)
    row = Number(row)

    if (row === undefined || row === "" || row < 0 || isNaN(row))  {
        row = 10;
    }
    // Setting default row,jadi dalam 1 page secara default ada 10 row data
    if (page === undefined || page === "" || page < 0 || isNaN(page)) {
        page = 1;
    }

    page = ((page - 1) * row);
    return {page,row};

}

module.exports = pagenation