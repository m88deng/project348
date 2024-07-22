import { useState } from "react";
import {
    Container, 
    FormControl, 
    FormGroup, 
    Label, 
    ModeLabel, 
    ModeOptions, 
    PlanTripForm, 
    RadioButton, 
    SearchButton
} from "../styles/PlanTrip.styled";

export default function PlanTrip() {
    const [leavingDay, setLeavingDay] = useState('');
    const [fromPoint, setFromPoint] = useState('');
    const [toPoint, setToPoint] = useState('');
    const [mode, setMode] = useState('bus');

    const handleRouteSearch = async (e) => {
        e.preventDefault();
        //console.log("searching routes...");
    };

    return (
        <Container>
            <PlanTripForm onSubmit={handleRouteSearch}>
                <FormGroup>
                    <Label htmlFor="leave-time">LEAVE TIME</Label>
                    <FormControl
                        type="date"
                        id="leave-time"
                        value={leavingDay}
                        onChange={(e) => setLeavingDay(e.target.value)}
                        placeholder="YY / MM / DD"
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="from-point">FROM</Label>
                    <FormControl
                        type="text"
                        id="from-point"
                        value={fromPoint}
                        onChange={(e) => setFromPoint(e.target.value)}
                        placeholder="Stop / Station"
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="to-point">TO</Label>
                    <FormControl
                        type="text"
                        id="to-point"
                        value={toPoint}
                        onChange={(e) => setToPoint(e.target.value)}
                        placeholder="Stop / Station"
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <ModeOptions>
                        <ModeLabel>
                            <RadioButton
                                type="radio"
                                name="mode"
                                value="bus"
                                checked={mode === 'bus'}
                                onChange={(e) => setMode(e.target.value)}
                            />
                            Bus
                        </ModeLabel>
                        <ModeLabel>
                            <RadioButton
                                type="radio"
                                name="mode"
                                value="train"
                                checked={mode === 'train'}
                                onChange={(e) => setMode(e.target.value)}
                            />
                            ION train
                        </ModeLabel>
                    </ModeOptions>
                </FormGroup>
                <FormGroup>
                    <SearchButton type="submit">Search</SearchButton>
                </FormGroup>
            </PlanTripForm>
        </Container>
    );
}
