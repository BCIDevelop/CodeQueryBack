export const paginationField=(page:number,per_page:number)=>{
    let offset=0
    if(page>1) offset=(page*per_page)-per_page

    return {limit:per_page,offset}
}

export const paginatioResults=(records:{count:number,rows:{}},page:number,perPage:number)=>{
    const {count,rows}=records
    const totalPages=Math.ceil(count/perPage)
    return {
    results:rows,
    pagination: {
        totalRecords: count,
        totalPages: totalPages,
        perPage: perPage,
        currentPage: page
    }
    }
}