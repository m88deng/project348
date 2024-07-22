import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    LookupScheduleForm,
    FormGroup,
    Label,
    FormControl,
    CheckboxLabel,
    Checkbox,
    SearchButton
} from "../styles/LookupSchedule.styled";

export default function LookupSchedule() {
    const [route, setRoute] = useState('');
    const [direction, setDirection] = useState('');
    const [wheelchair, setWheelchair] = useState(false);
    const navigate = useNavigate();

    const handleScheduleSearch = async (e) => {
        e.preventDefault();
        // For the sake of example, we'll use a static list of stops
        const stops = ["Stop 1", "Stop 2", "Stop 3", "Stop 4"];

        const today = new Date().toISOString().slice(0, 10);
        navigate("/route-stops", {
            state: {
                date: today,
                route,
                direction,
                stops
            }
        });
    }

    return (
        <div>
            <Container>
                <LookupScheduleForm onSubmit={handleScheduleSearch}>
                    <FormGroup>
                        <Label htmlFor="route">Route</Label>
                        <FormControl
                            type="text"
                            id="route"
                            value={route}
                            onChange={(e) => setRoute(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="direction">Direction</Label>
                        <FormControl
                            type="text"
                            id="direction"
                            value={direction}
                            onChange={(e) => setDirection(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <CheckboxLabel>
                            <Checkbox
                                type="checkbox"
                                checked={wheelchair}
                                onChange={(e) => setWheelchair(e.target.checked)}
                            />
                            Wheelchair boarding available
                        </CheckboxLabel>
                    </FormGroup>
                    <FormGroup>
                        <SearchButton type="submit">Lookup</SearchButton>
                    </FormGroup>
                </LookupScheduleForm>
            </Container>
        </div>
    );
}
