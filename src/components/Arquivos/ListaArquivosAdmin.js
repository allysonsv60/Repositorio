import React, { useEffect, useState } from 'react';
import { db } from '../../database/firebase';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const ListaArquivosAdmin = ({ tipoArquivo }) => {
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
        console.error(`Erro ao buscar arquivos do tipo ${tipoArquivo}:`, error);
      }
    };
    fetchArquivos();
  }, [tipoArquivo]);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este arquivo?")) {
      try {
        await deleteDoc(doc(db, tipoArquivo, id));
        setArquivos(arquivos.filter((arquivo) => arquivo.id !== id));
      } catch (error) {
        console.error(`Erro ao excluir arquivo com ID ${id}:`, error);
      }
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id); 
  };

  const filteredArquivos = arquivos.filter((arquivo) =>
    arquivo.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-table">
      <h2>{tipoArquivo === 'tccs' ? 'TCCs' : tipoArquivo === 'livros' ? 'Livros' : 'Materiais Complementares'}</h2>

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
                      <div className="arquivo-acoes">
                        <button onClick={() => navigate(`/edit-${tipoArquivo}/${arquivo.id}`)}>Editar</button>
                        <button onClick={() => handleDelete(arquivo.id)}>Excluir</button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <button onClick={() => navigate(-1)}>Voltar</button>
      <button onClick={() => navigate(`/add-${tipoArquivo}`)}>
        Adicionar Novo {tipoArquivo === 'tccs' ? 'TCC' : tipoArquivo === 'livros' ? 'Livro' : 'Material Complementar'}
      </button>
    </div>
  );
};

export default ListaArquivosAdmin;
