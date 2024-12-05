import * as React from "react";

export interface PaginationProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  totalPage: number;
  color: "primary" | "secondary";
  isNumber?: boolean;
}
