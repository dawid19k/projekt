import React from 'react';

const ItemList = ({ items, deleteItem, editItem }) => (
    <div style={{ textAlign: 'center', margin: '20px' }}>
        {items.map((item) => (
            <div key={item._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <button onClick={() => deleteItem(item._id)}>Usun</button>
                <button onClick={() => editItem(item._id)}>Edytuj</button>
            </div>
        ))}
    </div>
);

export default ItemList;
