import {ChangeEvent, memo, useState} from "react";
import TextField from "@mui/material/TextField/TextField";

type PropsType = {
    value: string
    onChange: (value: string) => void
}

export const EditableSpan = memo(({ value, onChange }: PropsType) => {
    console.log('EditableSpan called')
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState(value)

    const editModeOn = () => {
        setEditMode(true)
    }

    const editModeOff = () => {
        setEditMode(false)
        onChange(title)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }


    return (
        <>
            {editMode ? <TextField
                variant={'outlined'}
                value={title}
                size={'small'}
                onChange={onChangeHandler}
                onBlur={editModeOff}
                autoFocus
            /> : <span onDoubleClick={editModeOn}>{title}</span>}
        </>
    )
})