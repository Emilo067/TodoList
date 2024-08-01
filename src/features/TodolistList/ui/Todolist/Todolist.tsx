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
import { Paginator } from "features/Paginator/ui/Paginator";
import { useSelector } from "react-redux";
import { AppRootStateType } from "app/store/store";
import Paper from "@mui/material/Paper";

type Props = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
};

export const Todolist = memo(({ todolist, tasks }: Props) => {
  const dispatch = useAppDispatch();
  const totalCount = useSelector<AppRootStateType, number>((state) =>
    state.tasksPaginator[todolist.id] ? state.tasksPaginator[todolist.id].totalCount : 0,
  );

  useEffect(() => {
    dispatch(fetchTasks(todolist.id));
  }, [todolist.id, dispatch, todolist.entityStatus]);

  let tasksForTodolist = tasks;
  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  } else if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  const addTaskHandler = (title: string) => {
    const thunk = tasksThunks.addTask({ todolistId: todolist.id, title });
    return dispatch(thunk);
  };

  return (
    <Paper
      style={{
        padding: "20px",
        position: "relative",
        width: "300px",
        wordWrap: "break-word",
      }}
      elevation={3}
      sx={{ p: "0 40px 40px 40px" }}
    >
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
      <TasksList tasksForTodolist={tasksForTodolist} todolist={todolist} />
      <Box sx={filterButtonsContainerSx}>
        <FilterTasksButtons todolist={todolist} />
      </Box>
      {totalCount > 3 && <Paginator totalCount={totalCount} todolistId={todolist.id} />}
    </Paper>
  );
});
