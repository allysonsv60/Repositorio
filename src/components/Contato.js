import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../database/firebase";
import { useNavigate } from 'react-router-dom';
import '../App.css';
import site from "../img/faeterj.gif";
import instagram from "../img/instagram.png";

const Contato = () => {
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
          <button onClick={handleVoltar}>Voltar</button> 
        </div>

        <h1>Contate-nos</h1>
        <p>
          Rua Sebastião Lacerda, s/n Fábrica - Paracambi/RJ - 26.600-000
        </p>
        <p>Tel.: +55 (21) 3693.3066</p>
        <p>
          Para mais informações, entre em contato conosco através do nosso e-mail: 
          <a href="mailto:contato@faeterj-paracambi.com.br"> contato@faeterj-paracambi.com.br</a>
        </p>
        <p>Visite nossas redes:</p>
        
      
        <div className="social-links">
          <a href="https://www.instagram.com/faeterjparacambi/" target="_blank" rel="noopener noreferrer">
            <img src={instagram} alt="Instagram" />
            <span>Instagram</span>
          </a>

          <a href="https://www.faeterj-prc.faetec.rj.gov.br/in%C3%ADcio" target="_blank" rel="noopener noreferrer">
            <img src={site} alt="Site" />
            <span>Site</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contato;