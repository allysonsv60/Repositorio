import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../database/firebase";
import { useNavigate } from 'react-router-dom';
import '../App.css';

const DuvidasFrequentes = () => {
  const [user, loading] = useAuthState(auth); 
  const navigate = useNavigate();
  const [activeIndexes, setActiveIndexes] = useState([]);

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

  const faqs = [
    { question: "O que é um repositório institucional ?", answer: "Um repositório institucional é um ambiente digital voltado ao armazenamento, à divulgação, ao acesso e à preservação da produção de uma instituição. É caracterizado como um conjunto de serviços que uma universidade oferece aos membros da sua comunidade, para a gestão e disseminação de materiais digitais criados pela instituição e pelos seus membros. Assim, os repositórios institucionais focam no armazenamento e na divulgação da produção científica e intelectual, incluindo artigos científicos e trabalhos apresentados em eventos, de autoria de docentes e alunos, entre outros." },
    { question: "O que é o Repositório Institucional da FAETERJ - Paracambi?", answer: " O Repositório Institucional armazenará produção acadêmico-científica desenvolvida na FAETERJ - Paracambi." },
    { question: "Como foi desenvolvido o RI da FAETERJ - Paracambi?", answer: "A ideia surgiu em julho de 2024, na escolha de tema para o TCC, devido a instituição não ter repositório digital para armazenar as produções acadêmicas-científica dos alunos." },
    { question: "Qual é o objetivo do RI?", answer: "A plataforma tem como objetivo reunir, organizar, disponibilizar em acesso aos docentes e discentes da instituição e preservar as produções científicas desenvolvidas no âmbito do FAETERJ (campus Paracambi)." },
    { question: "Quem pode se registrar no RI ?", answer: "Somente pessoas ligadas a instituição poderão ter acesso ao no Repositório. Com o login, você terá acesso aos arquivos disponibilizados pela FAETERJ (campus Paracambi)." },
///Fazer outras questões
  ];

  const toggleAnswer = (index) => {
    setActiveIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <div className="dashboard-container">
      <div className="content"> 
        <div className="button-group">
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleVoltar}>Voltar</button> 
        </div>

        <h1>Perguntas Frequentes (FAQs) sobre o RI - FAETERJ (Paracambi)</h1>
        <p> Aqui você poderá encontrar uma série de perguntas com as respectivas respostas sobre o RI - FAETERJ (Paracambi).</p>
        
        <div className="faq-wrapper">
          <div className="faq-section">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 onClick={() => toggleAnswer(index)} className="faq-question">
                  {faq.question}
                </h3>
                {activeIndexes.includes(index) && <p className="faq-answer">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuvidasFrequentes;
