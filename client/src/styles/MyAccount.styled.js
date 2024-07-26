import styled from "styled-components";
import Select from 'react-select';

export const Container = styled.div`
    text-align: center;
    margin: 20px;
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    margin-bottom: 60px;

    .SavedRoutesDiv{
        width: 100%;
        margin: 0;
        padding-top: 50px;
    }
`;

export const AccountContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5%;
`;

export const AccountAvatar = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 20px;
`;

export const AccountUsername = styled.h1`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
`;

export const LogOut = styled.button`
    border: transparent;
    background-color: transparent;
    color: blue;
    text-decoration: underline;
`;

export const CustomSelect = styled(Select)`
    width: 100%;
    font-size: 16px;
    margin-top:10px;
    margin-bottom: 20px;
`;

export const Pt4 = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
    flex-direction: column;
    align-items: center;
`;

export const Col3 = styled.div`
    flex: 0 0 auto;
    width: 25%;
    margin-top: 10px;
`;

export const SaveButton = styled.button`
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
    height: 1000px;
    overflow: auto; 
    border: 2px solid #ddd; 
    border-collapse: collapse;
    margin-top: 20px;
`;

export const SaveTripRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    border-bottom: 2px solid #ddd;
    width: 105%;
    justify-content: space-between; 

    &:nth-child(odd) {
        background-color: #ffffff; 
    }

    &:nth-child(even) {
        background-color: #f0f8ff; 
    }
`;

export const RemoveButton = styled.button`
    background-color: #ff4d4d; 
    color: #ffffff;
    border: none;
    max-width: 100px;
    padding: 5px 5px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
        background-color: #ff1a1a; 
    }
`;

