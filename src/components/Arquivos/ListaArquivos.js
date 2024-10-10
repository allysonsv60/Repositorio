import React, { useEffect, useState } from 'react';
import { db } from '../../database/firebase';
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'; 

const ListaArquivos = ({ tipoArquivo }) => {
  const [arquivos, setArquivos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchArquivos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, tipoArquivo));
        const arquivosList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setArquivos(arquivosList);
      } catch (error) {
        console.error("Erro ao buscar arquivos: ", error);
      }
    };
    fetchArquivos();
  }, [tipoArquivo]);

  const filteredArquivos = arquivos.filter((arquivo) =>
    arquivo.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  
  const handleVoltar = () => {
    navigate(-1); 
  };

  return (
    <div className="container-table">
      <h2>{tipoArquivo === 'tccs' ? 'TCCs' : tipoArquivo === 'livros' ? 'Livros' : 'Materiais Complementares'}</h2>

      <button onClick={handleVoltar} style={{ marginBottom: '20px', padding: '10px 20px' }}>
        Voltar
      </button>

      <table>
        <thead>
          <tr>
            <th colSpan="2">
              <input
                type="text"
                placeholder="Buscar por título"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            </th>
          </tr>
          <tr>
            <th>Título</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredArquivos.map((arquivo) => (
            <React.Fragment key={arquivo.id}>
              <tr>
                <td>{arquivo.titulo}</td>
                <td>
                  <button onClick={() => toggleRow(arquivo.id)}>
                    {expandedRow === arquivo.id ? 'Fechar' : 'Detalhes'}
                  </button>
                </td>
              </tr>

              {expandedRow === arquivo.id && (
                <tr>
                  <td colSpan="2">
                    <div className="arquivo-detalhes">
                      <p><strong>Descrição:</strong> {arquivo.descricao}</p>
                      <a href={arquivo.arquivo} target="_blank" rel="noopener noreferrer">Abrir Arquivo</a>
                      </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaArquivos;
