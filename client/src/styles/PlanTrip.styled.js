import styled from "styled-components";

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
export const PlantripContainer = styled.section`
    width: 100%;
    max-width:auto;
    border-top: 0px solid #ddd; 
    border-collapse: collapse;
    overflow: auto; 
    margin: 0 auto;
    padding: 20px 5% 60px;

    .PlantripRow {
        width: auto;

        &:nth-child(odd) {
        background-color: #ffffff;
        }

        &:nth-child(even) {
        background-color: #f0f8ff; 
        }
    }

    .loadingDiv {
        width: 100%;
        text-align: center;
    }
`;
