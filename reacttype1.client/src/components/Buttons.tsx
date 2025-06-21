import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const SubmitButton = ({ disabled }: { disabled: boolean }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-wrap gap-5"  >
        <br/>
            <Button color="gray" type="submit" disabled={disabled}>Submit</Button>&nbsp;&nbsp;
            <Button  color="gray" onClick={() => navigate(-1)}>Go back to list</Button>
        </div>
    );
};

export const DeleteButton = ({ DeleteItem, disabled }: ButtonProps) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-wrap gap-2" >
            <br />
            <Button pill color="gray" onClick={DeleteItem} disabled={disabled}>Delete Record</Button>&nbsp;&nbsp;
            <Button pill color="gray" onClick={() => navigate(-1)}>Go back to list</Button>
        </div>
    );
};

export const ReturnButton = ({ Back, disabled }: ReturnProps) => {
    return (
        <div className="flex flex-wrap gap-2" >
            <br />
            <Button pill color="gray" type="submit" disabled={disabled}>Submit</Button>&nbsp;&nbsp;
            <Button pill color="gray" onClick={() => Back()}>Go back to list</Button>
        </div>
    );
};


export default SubmitButton;

interface ButtonProps {
    DeleteItem: () => void;
    disabled: boolean;
}

interface ReturnProps {
    Back: () => void;
    disabled: boolean; 
}



