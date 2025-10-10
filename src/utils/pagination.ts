export const parsePagination = (
  page?: string | string[],
  limit?: string | string[],
  defaultPage = 1,
  defaultLimit = 20
) => {
  const pageNumber =
    parseInt(Array.isArray(page) ? page[0] : page || "", 10) || defaultPage;
  const limitNumber =
    parseInt(Array.isArray(limit) ? limit[0] : limit || "", 10) || defaultLimit;
  return { page: pageNumber, limit: limitNumber };
};
