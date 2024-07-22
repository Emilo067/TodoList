import TextField from "@mui/material/TextField/TextField";
import { ChangeEvent, KeyboardEvent, memo, useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IconButton from "@mui/material/IconButton";
import { ResponseType } from "common/types/ResponseType";
import { unwrapResult } from "@reduxjs/toolkit";

export type AddItemFormPropsType = {
  addItem: (title: string) => Promise<any>;
  disabled?: boolean;
};

export const AddItemForm = memo(({ addItem, disabled = false }: AddItemFormPropsType) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addItemHandler = () => {
    if (title.trim() !== "") {
      addItem(title.trim())
        .then(unwrapResult)
        .then((res: ResponseType) => {
          setTitle("");
        })
        .catch((rej: ResponseType) => {
          debugger;
          setError(rej.messages[0]);
        });
    } else {
      setError("Title is required");
    }
  };

  const changeItemHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  };

  const addItemOnKeyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null);
    }
    if (event.key === "Enter") {
      addItemHandler();
    }
  };

  return (
    <div>
      <TextField
        label="Enter a title"
        variant={"outlined"}
        className={error ? "error" : ""}
        value={title}
        error={!!error}
        helperText={error}
        size={"small"}
        onChange={changeItemHandler}
        onKeyUp={addItemOnKeyUpHandler}
      />
      <IconButton onClick={addItemHandler} color={"primary"} disabled={disabled}>
        <AddBoxIcon />
      </IconButton>
    </div>
  );
});
