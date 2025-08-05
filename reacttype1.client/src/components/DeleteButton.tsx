import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
    DeleteItem: () => void;
    disabled: boolean;
}

 const DeleteButton = ({ DeleteItem, disabled }: ButtonProps) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-wrap gap-2" >
            <br />
            <Button pill color="gray" onClick={DeleteItem} disabled={disabled}>Delete Record</Button>&nbsp;&nbsp;
            <Button pill color="gray" onClick={() => navigate(-1)}>Go back to list</Button>
        </div>
    );
};

export default DeleteButton;
