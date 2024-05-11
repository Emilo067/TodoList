import React, {ChangeEvent, memo} from 'react';
import {getListItemSx} from "../Todolist.style";
import {Checkbox} from "@mui/material";
import {EditableSpan} from "../../common/components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import {TaskType} from "../../App/AppWithRedux";

type TaskProps = {
    task: TaskType
    todolistId: string
    changeTaskStatus: (todoId: string, taskId: string, isDone: boolean) => void
    changeTaskTitle: (todoId: string, taskId: string, title: string) => void
    removeTask: (todoId: string, taskId: string)=>void
}

export const Task = memo(({todolistId, task, changeTaskStatus, removeTask, changeTaskTitle}: TaskProps) => {

   const onTitleChangeHandler = (newValue: string) => {
        changeTaskTitle(todolistId, task.id, newValue)
   }
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(todolistId, task.id, e.currentTarget.checked)
    }

    const removeTaskHandler = () => {
        removeTask(todolistId, task.id)
    }

    return (
        <ListItem sx={getListItemSx(task.isDone)} disableGutters disablePadding>
            <div>
                <Checkbox checked={task.isDone}
                          onChange={changeTaskStatusHandler}/>
                <EditableSpan onChange={onTitleChangeHandler}
                              value={task.title}/>
            </div>
            <IconButton onClick={removeTaskHandler}>
                <DeleteIcon/>
            </IconButton>
        </ListItem>
    );
});