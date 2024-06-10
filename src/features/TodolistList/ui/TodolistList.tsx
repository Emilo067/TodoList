import React, { useCallback, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { TodolistDomainType, todolistsThunks } from "features/TodolistList/model/todolists/todolists.reducer";
import { TasksStateType } from "app/App";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "features/TodolistList/ui/Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppRootStateType } from "app/store";
import { selectIsLoggedIn } from "features/auth/model/auth.selectors";
import { selectTasks } from "features/TodolistList/model/tasks/tasks.selector";
import { selectTodolists } from "features/TodolistList/model/todolists/todolists-selector";
import { useAppDispatch } from "common/hooks/useAppDispatch";

export const TodolistsList: React.FC = () => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(selectTodolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>(selectTasks);
  const isLoggedIn = useSelector<AppRootStateType, boolean>(selectIsLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    dispatch(todolistsThunks.fetchTodolists());
  }, [isLoggedIn, dispatch]);

  const addTodolistHandler = useCallback(
    (title: string) => {
      const thunk = todolistsThunks.addTodolist(title);
      return dispatch(thunk).unwrap();
    },
    [dispatch],
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container sx={{ mb: "60px" }}>
        <AddItemForm addItem={addTodolistHandler} />
      </Grid>

      <Grid container spacing={4} gap={5} alignContent={"center"}>
        {todolists.map((tl) => {
          return (
            <Grid key={tl.id}>
              <Paper sx={{ p: "0 40px 40px 40px" }}>
                <Todolist todolist={tl} tasks={tasks[tl.id]} date={new Date()} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
