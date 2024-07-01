import React, { memo, useEffect } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import Box from "@mui/material/Box";
import { filterButtonsContainerSx } from "features/TodolistList/ui/Todolist/Todolist.style";
import { TodolistDomainType } from "features/TodolistList/model/todolists/todolists.reducer";
import { TaskStatuses } from "common/enums/enums";
import { fetchTasks, tasksThunks } from "features/TodolistList/model/tasks/tasks.reducer";
import { TaskType } from "features/TodolistList/api/taskApi.types";
import { FilterTasksButtons } from "./FilterTasksButtons";
import { TodolistTitle } from "features/TodolistList/ui/Todolist/TodolistTitle/TodolistTitle";
import { TasksList } from "./TasksList/TasksList";
import { useAppDispatch } from "common/hooks/useAppDispatch";

type Props = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
};

export const Todolist = memo(({ todolist, tasks }: Props) => {
  console.log("Todolist called");

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasks(todolist.id));
  }, [todolist.id, dispatch]);

  let tasksForTodolist = tasks;
  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  } else if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  const addTaskHandler = (title: string) => {
    const thunk = tasksThunks.addTask({ todolistId: todolist.id, title });
    return dispatch(thunk).unwrap();
  };

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
      <TasksList tasksForTodolist={tasksForTodolist} todolist={todolist} />
      <Box sx={filterButtonsContainerSx}>
        <FilterTasksButtons todolist={todolist} />
      </Box>
    </div>
  );
});
