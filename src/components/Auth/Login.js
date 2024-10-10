import React, { useState } from 'react';
import { auth, db } from '../../database/firebase'; 
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore'; 
import '../../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Usuário logado:', user);

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        localStorage.setItem('userUsuario', userData.usuario);

        navigate('/dashboard');
      } else {
        throw new Error("Dados do usuário não encontrados.");
      }
    } catch (error) {
      console.error("Erro no login: ", error);
      alert("Erro no login: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button className="btn btn-primary" onClick={handleLogin}>Login</button>
      <p>Não tem uma conta? <a href="/cadastro">Registre-se</a></p>
    </div>
  );
};

export default Login;

