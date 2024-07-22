import styled from "styled-components";

export const StyledPlanTripTop = styled.div`
    width: 100vw;
    height: 40px;
    background-color: #F0F0F0;
`;

export const Container = styled.div`
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
`;

export const PlanTripForm = styled.form`
    display: flex;
    flex-direction: column;
`;

export const FormGroup = styled.div`
    margin-bottom: 20px;
`;

export const Label = styled.label`
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
`;

export const FormControl = styled.input`
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const ModeOptions = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
`;

export const ModeLabel = styled.label`
    display: flex;
    align-items: center;
    font-size: 16px;
`;

export const RadioButton = styled.input`
    margin-right: 10px;
`;

export const SearchButton = styled.button`
    width: 100%;
    padding: 15px;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 18px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;
