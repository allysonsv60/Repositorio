import React, { useEffect, useState } from 'react';
import { db } from '../../database/firebase';
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const ListaArquivosProf = ({ tipoArquivo }) => {
  const [arquivos, setArquivos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArquivos = async () => {
      try {
        console.log("Tipo de Arquivo:", tipoArquivo);
        
        const q = query(collection(db, 'arquivos'), where("tipoArquivo", "==", "artigo"));
        const querySnapshot = await getDocs(q);
        const arquivosList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        console.log("Arquivos encontrados:", arquivosList);
        setArquivos(arquivosList);
      } catch (error) {
        console.error("Erro ao buscar arquivos: ", error);
      }
    };

    fetchArquivos();
  }, [tipoArquivo]);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este arquivo?")) {
      await deleteDoc(doc(db, 'arquivos', id));
      setArquivos(arquivos.filter((arquivo) => arquivo.id !== id));
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id); 
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      try {
        const q = query(
          collection(db, 'arquivos'),
          where('tipoArquivo', '==', tipoArquivo),
          where('titulo', '>=', e.target.value),
          where('titulo', '<=', e.target.value + '\uf8ff')
        );
        const querySnapshot = await getDocs(q);
        const arquivosList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setArquivos(arquivosList);
      } catch (error) {
        console.error("Erro ao buscar arquivos: ", error);
      }
    } else {
      const fetchArquivos = async () => {
        try {
          const q = query(collection(db, 'arquivos'), where('tipoArquivo', '==', tipoArquivo));
          const querySnapshot = await getDocs(q);
          const arquivosList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log("Arquivos encontrados na busca geral:", arquivosList);
          setArquivos(arquivosList);
        } catch (error) {
          console.error("Erro ao buscar arquivos: ", error);
        }
      };

      fetchArquivos();
    }
  };

  return (
    <div className="container-table">
      <h2>{tipoArquivo === 'tccs' ? 'TCCs' : tipoArquivo === 'livros' ? 'Livros' : 'Materiais Complementares'}</h2>

      <input
        type="text"
        placeholder="Buscar por título"
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }} 
      />

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {arquivos.length > 0 ? (
            arquivos.map((arquivo) => (
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
            ))
          ) : (
            <tr>
              <td colSpan="2">Nenhum arquivo encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={() => navigate(-1)}>Voltar</button> 
      <button onClick={() => navigate(`/add-${tipoArquivo}`)}>
        Adicionar Novo {tipoArquivo === 'tccs' ? 'TCC' : tipoArquivo === 'livros' ? 'Livro' : 'Material Complementar'}
      </button>
    </div>
  );
};

export default ListaArquivosProf;
