import React from "react";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { TodolistDomainType, todolistsThunks } from "features/TodolistList/model/todolists/todolists.reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";

type Props = {
  todolist: TodolistDomainType;
};

export const TodolistTitle = ({ todolist }: Props) => {
  const dispatch = useAppDispatch();

  const removeTodolistHandler = () => {
    const thunk = todolistsThunks.removeTodolist(todolist.id);
    dispatch(thunk);
  };

  const updateTodolistHandler = (title: string) => {
    const thunk = todolistsThunks.changeTodolistTitle({ todolistId: todolist.id, title });
    dispatch(thunk);
  };

  return (
    <div className={"todolist-title-container"}>
      <h3>
        <EditableSpan
          disabled={todolist.entityStatus === "loading"}
          value={todolist.title}
          onChange={updateTodolistHandler}
        />
      </h3>
      <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};
