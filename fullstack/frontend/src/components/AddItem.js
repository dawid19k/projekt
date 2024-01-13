import React, { useState } from 'react';

const AddItem = ({ addItem }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addItem({ name, description });
        setName('');
        setDescription('');
    };

    return (
        <form style={{ textAlign: 'center', margin: '20px' }} onSubmit={handleSubmit}>
           
            <input
                type="text"
                placeholder="Cel"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder="Opis"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <button type="submit">Dodaj</button>
        </form>
    );
};

export default AddItem;
