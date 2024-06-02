import React, {ChangeEvent, memo} from 'react';
import {getListItemSx} from "../Todolist.style";
import {Checkbox} from "@mui/material";
import {EditableSpan} from "../../../../common/components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import {TaskStatuses, TaskType} from '../../../../api/todolist-api';
import {useAppSelector} from "../../../../model/store";
import {RequestStatusType} from "../../../../App/app-reducer";

type TaskProps = {
    task: TaskType
    todolistId: string
    changeTaskStatus: (todoId: string, taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (todoId: string, taskId: string, title: string) => void
    removeTask: (todoId: string, taskId: string)=>void
    entityStatus: RequestStatusType
}

export const Task = memo(({entityStatus, todolistId, task, changeTaskStatus, removeTask, changeTaskTitle}: TaskProps) => {


   const onTitleChangeHandler = (newValue: string) => {
        changeTaskTitle(todolistId, task.id, newValue)
   }
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.checked)
        changeTaskStatus(todolistId, task.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)
    }

    const removeTaskHandler = () => {
        removeTask(todolistId, task.id)
    }

    return (
        <ListItem sx={getListItemSx(task.status)} disableGutters disablePadding>
            <div>
                <Checkbox checked={task.status === TaskStatuses.Completed}
                          onChange={changeTaskStatusHandler}/>
                <EditableSpan disabled={entityStatus === 'loading'} onChange={onTitleChangeHandler}
                              value={task.title}/>
            </div>
            <IconButton onClick={removeTaskHandler} disabled={entityStatus === 'loading'}>
                <DeleteIcon/>
            </IconButton>
        </ListItem>
    );
});