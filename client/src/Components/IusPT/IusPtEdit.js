import React from 'react';
import { useParams } from 'react-router-dom';
const IusPtEdit = () => {
    const { id } = useParams();
    
    return (
        <h1>Hello {id}</h1>
    )
}
export default IusPtEdit