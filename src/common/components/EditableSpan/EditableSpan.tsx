import {ChangeEvent, memo, useState} from "react";
import TextField from "@mui/material/TextField/TextField";

type PropsType = {
    value: string
    onChange: (value: string) => void
    disabled: boolean
}

export const EditableSpan = memo(({disabled, value, onChange }: PropsType) => {
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
            {editMode && !disabled ? <TextField
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