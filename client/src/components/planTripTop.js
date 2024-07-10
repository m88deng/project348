import { StyledPlanTripTop } from "../styles/PlanTrip.styled";

export default function PlanTripTop() {
    return (
        <StyledPlanTripTop className="container justify-content-center text-center">
            <div className="row">
                <div className="col-4">depature time</div>
                <div className="col-4">From Station</div>
                <div className="col-4">To Station</div>
            </div>
        </StyledPlanTripTop>
    );
}