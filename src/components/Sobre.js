import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../database/firebase";
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Sobre = () => {

  const [user, loading] = useAuthState(auth); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
      alert("Logout bem-sucedido!");
    } catch (error) {
      console.error("Erro ao fazer logout", error);
      alert("Erro ao fazer logout. Tente novamente.");
    }
  };

  if (loading) {
    return <p>Carregando...</p>; 
  }

  const handleVoltar = () => {
    navigate(-1); 
  };


  return (
    <div className="dashboard-container">

      <div className="content"> 
        
        <div className="button-group">
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleVoltar} >Voltar</button> 
        </div>

        <h1>Sobre o Projeto</h1>
        <p>
          Este projeto é uma plataforma para gerenciamento de TCCs (Trabalhos de Conclusão de Curso), onde alunos podem
          enviar seus trabalhos, acessar materiais complementares, e interagir com professores e administradores.
        </p>
        <h2>Objetivos</h2>
        <ul>
          <li>Facilitar o envio e o gerenciamento de TCCs pelos alunos.</li>
          <li>Proporcionar acesso a livros e materiais complementares.</li>
          <li>Permitir que professores e administradores acompanhem o progresso dos alunos.</li>
        </ul>
        <h2>Equipe</h2>
        <p>
          Desenvolvido por uma equipe dedicada de estudantes da FAETERJ, comprometida em oferecer uma solução eficaz e
          acessível para o gerenciamento de TCCs.
        </p>
       
      </div>
    </div>
  );
};

export default Sobre;