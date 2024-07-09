import { StyledPlanTripTop } from "../styles/PlanTrip.styled";

export default function PlanTripTop() {
    return (
        <StyledPlanTripTop className="container">
            <div className="row">
                <div>depature time</div>
                <div>From Station</div>
                <div>To Station</div>
            </div>
        </StyledPlanTripTop>
    );
}