import {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/login';
import Register from './pages/register';
import PrivateRoute from "./components/PrivateRoute.tsx";

function App() {

    const [userName, setUserName] = useState<string>('Гость');

    useEffect(() => {

        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const path = window.location.pathname;

            const publicPaths = ['/login', '/register', '/'];

            if (!token) {
                console.log("Нет токена");
                if (!publicPaths.includes(path)) {
                    window.location.href = '/login';
                }
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/users/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const user = await response.json();

                    console.log("Данные пользователя:", user);
                    setUserName(user.name);

                } else {
                    console.log("Токен недействителен");
                    localStorage.removeItem('token');
                    setUserName('Гость');
                    if (!publicPaths.includes(path)) {
                        window.location.href = '/login';
                    }
                }
            } catch (err) {
                console.error("Ошибка при проверке авторизации:", err);
            }
        };

        checkAuth();
    }, []);

    return (
        <Router>
            <Header />
            <div style={{ paddingTop: '60px' }}>
                <Routes>
                    <Route path="/" element={<div style={{ textAlign: 'center', marginTop: '50px' }}>Главная страница. Пользователь:{userName} </div>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<PrivateRoute />}>

                        //ТУТ ВСЕ СЛЕДУЮЩИЕ СТРАНИЦЫ КОТОРЫЕ НЕ ЗАЛОГИНЕННЫЙ НЕ ВИДИТ

                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
