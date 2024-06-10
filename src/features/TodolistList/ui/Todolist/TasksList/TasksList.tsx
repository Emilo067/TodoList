import React from "react";
import List from "@mui/material/List";
import { Task } from "features/TodolistList/ui/Todolist/TasksList/Task/Task";
import { TaskType } from "features/TodolistList/api/taskApi.types";
import { TodolistDomainType } from "features/TodolistList/model/todolists/todolists.reducer";

type Props = {
  tasksForTodolist: TaskType[];
  todolist: TodolistDomainType;
};

export const TasksList = ({ tasksForTodolist, todolist }: Props) => {
  return (
    <>
      {tasksForTodolist.length ? (
        <List>
          {tasksForTodolist.map((t) => {
            return <Task key={t.id} todolistId={todolist.id} task={t} entityStatus={todolist.entityStatus} />;
          })}
        </List>
      ) : (
        <h3 style={{ margin: "0", marginTop: "5px" }}>Тасок нет</h3>
      )}
    </>
  );
};
