import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../database/firebase";
import { useNavigate } from 'react-router-dom';
import '../App.css';

const MeusEnvios = () => {
  const [user, loading] = useAuthState(auth);
  const [arquivos, setArquivos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate(); 
  const itemsPerPage = 10; 
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const fetchArquivos = async () => {
      if (!user) return; 
      try {
        const q = query(collection(db, 'arquivos'), where('autorId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const arquivosList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setArquivos(arquivosList);
      } catch (error) {
        console.error("Erro ao buscar arquivos: ", error);
      }
    };
    fetchArquivos();
  }, [user]);

  const filteredArquivos = arquivos.filter((arquivo) =>
    (arquivo.titulo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (arquivo.autor?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (arquivo.ano?.toString().includes(searchTerm)) ||
    (arquivo.tipoArquivo?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleVoltar = () => {
    navigate(-1); 
  };

  
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este arquivo?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'arquivos', id));
        setArquivos(arquivos.filter(arquivo => arquivo.id !== id)); 
        alert("Arquivo excluído com sucesso.");
      } catch (error) {
        console.error("Erro ao excluir o arquivo: ", error);
        alert("Erro ao excluir o arquivo. Tente novamente.");
      }
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArquivos.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container-table">
      <h2>Meus Envios</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Pesquisar por título, autor, ano ou tipo de material..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Ano</th>
            <th>Tipo de Material</th>
            <th>ID do Autor</th> 
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((arquivo) => (
              <React.Fragment key={arquivo.id}>
                <tr>
                  <td>{arquivo.titulo || 'Título desconhecido'}</td>
                  <td>{arquivo.autor || 'Autor desconhecido'}</td>
                  <td>{arquivo.ano || 'Ano desconhecido'}</td>
                  <td>{arquivo.tipoArquivo || 'Desconhecido'}</td>
                  <td>{arquivo.autorId || 'ID desconhecido'}</td> 
                  <td>
                    <button onClick={() => toggleRow(arquivo.id)}>
                      {expandedRow === arquivo.id ? 'Fechar' : 'Detalhes'}
                    </button>
                  </td>
                </tr>
                {expandedRow === arquivo.id && (
                  <tr>
                    <td colSpan="6"> 
                      <div className="arquivo-detalhes">
                        <p><strong>Descrição:</strong> {arquivo.descricao || 'Descrição não disponível'}</p>
                        <a href={arquivo.arquivo} target="_blank" rel="noopener noreferrer">Abrir Arquivo</a>
                        <div className="detalhe-acoes">
                          <button onClick={() => navigate(`/edit-materiais/${arquivo.id}`)}>
                            Alterar
                          </button>
                          <button onClick={() => handleDelete(arquivo.id)}>
                            Excluir
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="6">Nenhum arquivo encontrado.</td> 
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination-container">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
        <span>Página {currentPage} de {Math.ceil(filteredArquivos.length / itemsPerPage)}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= Math.ceil(filteredArquivos.length / itemsPerPage)}>Próxima</button>
      </div>
      <button onClick={handleVoltar} style={{ marginBottom: '20px', padding: '10px 20px' }}>
        Voltar
      </button>
    </div>
  );
};

export default MeusEnvios;