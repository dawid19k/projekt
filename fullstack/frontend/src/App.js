import React, { useState, useEffect } from 'react';
import AddItem from './components/AddItem';
import ItemList from './components/ItemList';
import Login from './components/Login';
import Register from './components/Register';

function App() {
    const [items, setItems] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(true);

    useEffect(() => {
        fetchItems();
        checkLoginStatus();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/items');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const addItem = async (item) => {
        try {
            const response = await fetch('http://localhost:5000/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });
            const data = await response.json();
            setItems([...items, data]);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/items/${id}`, {
                method: 'DELETE',
            });
            setItems(items.filter((item) => item._id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const editItem = async (id, updatedItem) => {
        try {
            const response = await fetch(`http://localhost:5000/api/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });
            const data = await response.json();

            // Zaktualizuj listę elementów po edycji
            setItems(
                items.map((item) => (item._id === id ? { ...item, ...data } : item))
            );
        } catch (error) {
            console.error('Error editing item:', error);
        }
    };

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/userData');
            if (response.ok) {
                setLoggedIn(true);
                setShowLogin(false);
            } else {
                setLoggedIn(false);
                setShowLogin(true);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                setLoggedIn(true);
                setShowLogin(false);
            } else {
                window.alert('Błędny login lub hasło. Spróbuj ponownie.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/logout');
            if (response.ok) {
                setLoggedIn(false);
                setShowLogin(true);
            } else {
                window.alert('Błąd wlogowania');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleRegister = async (username, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                window.alert('Rejestracja powiodła się');
            } else {
                window.alert('Rejestracja niepowiodła się');
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            {showLogin && (
                <div>
                    <h1>Logowanie</h1>
                    <Login login={handleLogin} />
                    <h1>Rejestracja</h1>
                    <Register register={handleRegister} />
                </div>
            )}
            {loggedIn && !showLogin && (
                <div>
                    <h1>Lista celów do zrealizowania</h1>
                   
                    <AddItem addItem={addItem} />
                    <ItemList items={items} deleteItem={deleteItem} editItem={editItem} />
                    <button style={{ margin: '10px' }} onClick={handleLogout}>Wyloguj</button>
                </div>
            )}
        </div>
    );
}

export default App;
