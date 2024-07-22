import Pagination from "@mui/material/Pagination";
import React from "react";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { tasksPaginatorThunks } from "features/Paginator/model/tasksPaginator.reducer";

type Props = {
  onChangePage?: (value: number) => void;
  portionSize?: number;
  totalCount?: number;
  todolistId: string;
};

export const Paginator = (props: Props) => {
  let pagesCount = Math.ceil((props.totalCount as number) / 10);
  const dispatch = useAppDispatch();

  const changePageHandler = (page: number) => {
    dispatch(tasksPaginatorThunks.fetchTasksPage({ currentPage: page, todolistId: props.todolistId }));
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <Pagination
        onChange={(event, page) => {
          changePageHandler(page);
        }}
        count={pagesCount}
        variant="outlined"
      />
    </div>
  );
};
