const default_page_limit = 0;
const default_page_Number = 1;
async function GenPagination(query) {
  const page = Math.abs(query.page) || default_page_Number;
  const limit = Math.abs(query.limit) || default_page_limit;
  const skip = (page - 1) * limit;
  return {
    skip,
    limit,
  };
}

module.exports = {
  GenPagination,
};
