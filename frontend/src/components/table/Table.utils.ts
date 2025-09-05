export const showPaginationNumber: (
  i: number,
  currentPage: number,
  pageCount: number
) => boolean = (i, currentPage, pageCount) => {
  const pageToRender = i + 1;
  // Always show first and last pages
  if (pageToRender === 1 || pageToRender === pageCount) {
    return true;
  }
  // Always show pages next to the current
  if (Math.abs(currentPage - pageToRender) <= 2) {
    return true;
  }
  // For when current page is at the left and right extremes
  if (currentPage <= 2 && pageToRender <= 5) {
    return true;
  }
  if (currentPage >= pageCount - 2 && pageToRender >= pageCount - 4) {
    return true;
  }
  return false;
};

type PaginationControl = {
  pageNumber?: number;
  skipDirection?: "forward" | "backward";
};
export const getPrefilledPaginationControls: (
  currentPage: number,
  pageCount: number
) => PaginationControl[] = (currentPage, pageCount) => {
  let includeSkip = false;
  const output = Array(pageCount)
    .fill("")
    .map((_, i) => {
      const showControl = showPaginationNumber(i, currentPage, pageCount);
      const skipControl = includeSkip
        ? { skipDirection: currentPage > i + 1 ? "backward" : "forward" }
        : null;
      const control = showControl ? { pageNumber: i + 1 } : skipControl;
      includeSkip = showControl;
      return control;
    })
    .filter(Boolean);
  return output as PaginationControl[];
};

export const currentNumberOfResults: (
  total: number,
  page: number,
  perPage: number
) => number = (total, page, perPage) => {
  if (perPage * page < total) {
    return perPage;
  }
  if (perPage * page >= total) {
    return total - perPage * (page - 1);
  }
  return total;
};