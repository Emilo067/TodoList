import React, {FC, memo} from 'react';
import Button, {ButtonProps} from "@mui/material/Button/Button";


type ButtonWithMemoPropsType = {} & ButtonProps

export const ButtonWithMemo: FC<ButtonWithMemoPropsType> = memo(({children, onClick, color, variant}: ButtonWithMemoPropsType) => {
    return (
        <Button
            variant={variant}
            color={color}
            onClick={onClick}
        >
            {children}
        </Button>
    );
})