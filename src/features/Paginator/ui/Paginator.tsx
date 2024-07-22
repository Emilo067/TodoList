import Pagination from "@mui/material/Pagination";
import React from "react";
import s from "./Paginator.module.css";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { tasksPaginatorThunks } from "features/Paginator/model/tasksPaginator.reducer";

type Props = {
  onChangePage?: (value: number) => void;
  portionSize?: number;
  totalCount?: number;
  todolistId: string;
};

export const Paginator = (props: Props) => {
  // const totalUsersCount = useAppSelector<number>((state) => state.users.totalUsersCount);
  // const pageSize = useSelector<number>((state) => state.users.pageSize);
  // const currentPage = useAppSelector<number>((state) => state.users.currentPage);
  //
  // const initialPortionNumber = Math.ceil(currentPage / portionSize);
  // const [portionNumber, setPortionNumber] = useState(initialPortionNumber);
  // console.log(portionNumber);
  let pagesCount = Math.ceil((props.totalCount as number) / 10);
  const dispatch = useAppDispatch();

  const changePageHandler = (page: number) => {
    dispatch(tasksPaginatorThunks.fetchTasksPage({ currentPage: page, todolistId: props.todolistId }));
  };

  // const portionsCount = Math.ceil(pagesCount / portionSize);
  // const leftPortionPageNumber = (portionNumber - 1) * portionSize + 1;
  // const rightPortionPageNumber = portionNumber * portionSize;
  //
  // const clickLeftPortionNumbePageHandler = () => {
  //   setPortionNumber(portionNumber - 1);
  // };
  //
  // const clickRightPortionNumbePageHandler = () => {
  //   setPortionNumber(portionNumber + 1);
  // };

  return (
    // <S.PaginatorWrapperStyle>
    //   {portionNumber > 1 && <button onClick={clickLeftPortionNumbePageHandler}>left</button>}
    //   <S.PagesWrapper>
    //     {pages
    //       .filter((p) => p >= leftPortionPageNumber && p <= rightPortionPageNumber)
    //       .map((p) => (
    //         <S.SelectedPage
    //           onClick={() => {
    //             onChangePage(p);
    //           }}
    //           isSelected={currentPage === p}
    //         >
    //           {p}
    //         </S.SelectedPage>
    //       ))}
    //   </S.PagesWrapper>
    //   {portionsCount > portionNumber && <button onClick={clickRightPortionNumbePageHandler}>right</button>}
    // </S.PaginatorWrapperStyle>
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
