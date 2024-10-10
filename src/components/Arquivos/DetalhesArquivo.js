import React, { useEffect, useState } from 'react';
import { db } from '../../database/firebase';
import { doc, getDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';

const DetalhesArquivo = ({ tipoArquivo }) => {
  const { id } = useParams();
  const [arquivo, setArquivo] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  useEffect(() => {
    const fetchArquivo = async () => {
      try {
        const docRef = doc(db, tipoArquivo, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArquivo(docSnap.data());
        } else {
          setError("Nenhum arquivo encontrado!");
        }
      } catch (err) {
        console.error("Erro ao buscar arquivo:", err);
        setError("Erro ao buscar arquivo.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArquivo();
  }, [id, tipoArquivo]);

  if (isLoading) return <div>Carregando...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{arquivo.titulo}</h2>
      <p><strong>Descrição:</strong> {arquivo.descricao}</p>
      {arquivo.arquivo && (
        <a href={arquivo.arquivo} target="_blank" rel="noopener noreferrer">
          Baixar Arquivo
        </a>
      )}
    </div>
  );
};

export default DetalhesArquivo;
