import { Button } from "flowbite-react";

interface ReturnProps {
    Back: () => void;
    disabled: boolean;
}

 const ReturnButton = ({ Back, disabled }: ReturnProps) => {
    return (
        <div className="flex flex-wrap gap-2" >
            <br />
            <Button pill color="gray" type="submit" disabled={disabled}>Submit</Button>&nbsp;&nbsp;
            <Button pill color="gray" onClick={() => Back()}>Go back to list</Button>
        </div>
    );
};

export default ReturnButton;









