import React, { ChangeEvent, memo } from "react";
import { getListItemSx } from "features/TodolistList/ui/Todolist/Todolist.style";
import { Checkbox } from "@mui/material";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import { RequestStatusType } from "app/model/app.reducer";
import { TaskStatuses } from "common/enums/enums";
import { tasksThunks } from "features/TodolistList/model/tasks/tasks.reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { TaskType } from "features/TodolistList/api/taskApi.types";

type TaskProps = {
  task: TaskType;
  todolistId: string;
  entityStatus: RequestStatusType;
};

export const Task = memo(({ entityStatus, todolistId, task }: TaskProps) => {
  const dispatch = useAppDispatch();
  const removeTaskHandler = () => {
    const thunk = tasksThunks.removeTask({ todolistId, taskId: task.id });
    dispatch(thunk);
  };
  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    dispatch(tasksThunks.updateTask({ todolistId, taskId: task.id, domainModel: { status } }));
  };

  const changeTaskTitleHandler = (title: string) => {
    const thunk = tasksThunks.updateTask({ todolistId, taskId: task.id, domainModel: { title } });
    dispatch(thunk);
  };
  return (
    <ListItem sx={getListItemSx(task.status)} disableGutters disablePadding>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Checkbox checked={task.status === TaskStatuses.Completed} onChange={changeTaskStatusHandler} />
        <EditableSpan disabled={entityStatus === "loading"} onChange={changeTaskTitleHandler} value={task.title} />
      </div>
      <IconButton onClick={removeTaskHandler} disabled={entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
});
