import React from "react";
import { ButtonWithMemo } from "common/components/Button/ButtonWithMemo";
import { TodolistDomainType, todolistsActions } from "features/TodolistList/model/todolists/todolists.reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";

type Props = {
  todolist: TodolistDomainType;
};

export const FilterTasksButtons = ({ todolist }: Props) => {
  const dispatch = useAppDispatch();
  const changeFilterAllHandler = () => {
    dispatch(todolistsActions.changeTodolistFilter({ id: todolist.id, filter: "all" }));
  };
  const changeFilterActiveHandler = () => {
    dispatch(todolistsActions.changeTodolistFilter({ id: todolist.id, filter: "active" }));
  };
  const changeFilterCompletedHandler = () => {
    dispatch(todolistsActions.changeTodolistFilter({ id: todolist.id, filter: "completed" }));
  };

  return (
    <>
      <ButtonWithMemo
        variant={todolist.filter === "all" ? "outlined" : "text"}
        color={"inherit"}
        onClick={changeFilterAllHandler}
      >
        All
      </ButtonWithMemo>
      <ButtonWithMemo
        variant={todolist.filter === "active" ? "outlined" : "text"}
        color={"primary"}
        onClick={changeFilterActiveHandler}
      >
        Active
      </ButtonWithMemo>
      <ButtonWithMemo
        variant={todolist.filter === "completed" ? "outlined" : "text"}
        color={"secondary"}
        onClick={changeFilterCompletedHandler}
      >
        Completed
      </ButtonWithMemo>
    </>
  );
};
