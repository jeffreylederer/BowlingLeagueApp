
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";


 const SubmitButton = ({ disabled }: { disabled: boolean }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-wrap gap-5"  >
            <br />
            <Button color="gray" type="submit" disabled={disabled}>Submit</Button>&nbsp;&nbsp;
            <Button color="gray" onClick={() => navigate(-1)}>Go back to list</Button>
        </div>
    );
};

export default SubmitButton;

