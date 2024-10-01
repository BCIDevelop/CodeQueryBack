"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatioResults = exports.paginationField = void 0;
const paginationField = (page, per_page) => {
    let offset = 0;
    if (page > 1)
        offset = (page * per_page) - per_page;
    return { limit: per_page, offset };
};
exports.paginationField = paginationField;
const paginatioResults = (records, page, perPage) => {
    const { count, rows } = records;
    const totalPages = Math.ceil(count / perPage);
    return {
        results: rows,
        pagination: {
            totalRecords: count,
            totalPages: totalPages,
            perPage: perPage,
            currentPage: page
        }
    };
};
exports.paginatioResults = paginatioResults;
