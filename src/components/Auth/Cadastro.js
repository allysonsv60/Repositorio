import React, { useState } from 'react';
import { auth, db } from '../../database/firebase';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore'; 
import '../../App.css'; 

const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [turno, setTurno] = useState('manha'); 
  const [curso, setCurso] = useState('Sistema de Informação'); 
  const [usuario, setUsuario] = useState('aluno'); 

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuário cadastrado com sucesso:', userCredential.user);

      await setDoc(doc(db, "users", userCredential.user.uid), { 
        email: email,
        nome: nome,
        matricula: matricula,  
        turno: turno,          
        curso: curso,          
        usuario: usuario,
      });
      
      console.log('Tipo de usuário salvo com sucesso:', usuario);
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Erro no registro: ", error);
      alert("Erro ao criar a conta: " + error.message);
    }
  };

  const handleVoltar = () => {
    navigate(-1); 
  };

  return (
    <div className="formulario-container">
      <h2>Registrar</h2>
      <form>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          required
        />
        <input
          type="text"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          placeholder="Matrícula"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <select
          value={turno}
          onChange={(e) => setTurno(e.target.value)}
          required
        >
          <option value="manha">Manhã</option>
          <option value="noite">Noite</option>
        </select>
        <select
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          required
        >
          <option value="Sistema de Informação">Sistema de Informação</option>
          <option value="Analise e Desenvolvimento de Sistema">Analise e Desenvolvimento de Sistema</option>
          <option value="Gestão Ambiental">Gestão Ambiental</option>
        </select>
        <select
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        >
          <option value="aluno">Aluno</option>
          <option value="professor">Professor</option>
          <option value="admin">Administrador</option>
        </select>
        <div className="form-buttons">
          <button className="btn-primary" type="button" onClick={handleRegister}>Registrar</button>
          <button className="btn-secondary" type="button" onClick={handleVoltar}>Voltar</button>
        </div>
      </form>
    </div>
  );
};

export default Cadastro;