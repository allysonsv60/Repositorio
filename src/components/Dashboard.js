import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../database/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import AdminDashboard from "./AdminDashboard";
import AlunoDashboard from "./AlunoDashboard";
import ProfessorDashboard from "./ProfessorDashboard";

function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [user, loading] = useAuthState(auth); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsuario(userData.usuario); 
          } else {
            console.log("Documento do usuário não encontrado para", user.uid);
          }
        } else {
          navigate("/login"); 
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    if (!loading) {
      fetchUsuario(); 
    }
  }, [user, loading, navigate]);



  if (loading || !usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="dashboard-container">
      
      {usuario === "aluno" && <AlunoDashboard />}
      {usuario === "admin" && <AdminDashboard />}
      {usuario === "professor" && <ProfessorDashboard />}

    </div>
  );
}

export default Dashboard;
