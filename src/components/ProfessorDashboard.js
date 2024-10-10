import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../database/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom';
import '../App.css'; 
import livros from "../img/livros-icon.png";
import artigos from "../img/artigos-icon.png";
import materiais from "../img/materiais-icon.png";

function ProfessorDashboard() { 
  const [user, loading] = useAuthState(auth); 
  const navigate = useNavigate();
  const [arquivos, setArquivos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filteredArquivos, setFilteredArquivos] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  useEffect(() => {
    const fetchArquivos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "arquivos"));
        const arquivosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Arquivos encontrados:", arquivosList); 
        setArquivos(arquivosList);
      } catch (error) {
        console.error("Erro ao buscar arquivos: ", error);
      }
    };

    fetchArquivos();
  }, []); 

  useEffect(() => {
    setFilteredArquivos(
      arquivos.filter(arquivo =>
        (arquivo.titulo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (arquivo.autor?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (arquivo.ano?.toString().includes(searchTerm)) ||
        (arquivo.tipoArquivo?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, arquivos]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este arquivo?")) {
      await deleteDoc(doc(db, "arquivos", id));
      setArquivos(arquivos.filter((arquivo) => arquivo.id !== id));
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id); 
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      const maxPage = Math.ceil(filteredArquivos.length / itemsPerPage);
      return Math.min(prevPage + 1, maxPage);
    });
  };

  if (loading) {
    return <p>Carregando...</p>; 
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArquivos.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="dashboard-container">
      <nav className="menu">
        <ul>
          <li><Link to="/tccs-prof">TCCs</Link></li>
          <li><Link to="/livros-prof">Livros</Link></li>
          <li><Link to="/materiais-prof">Materiais Complementares</Link></li>
          <li><Link to="/meus-envios">Meus Envios</Link></li>
          <li><Link to="/contato">Contate-nos</Link></li>
          <li><Link to="/duvidas-frequentes">Dúvidas Frequentes</Link></li>
          <li><Link to="/sobre">Sobre</Link></li>
          <li><Link to="/cadastro">Cadastrar Novo Usuário</Link></li> 
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>

      <div className="dashboard">
        <h1>Repositório Institucional da FAETERJ - Paracambi</h1>
        <p>
          Bem-vindo ao Repositório Institucional da FAETERJ - Paracambi. O
          Repositório Institucional (RI) da Faculdade de Educação Tecnológica do
          Estado do Rio de Janeiro (Campus Paracambi) tem como missão: armazenar,
          preservar, divulgar e oferecer acesso à produção científica e
          institucional da FAETERJ. Possui como objetivos:
        </p>
        <ul>
          <li>Contribuir para o aumento da visibilidade da produção científica da FAETERJ;</li>
          <li>PROFESSOR</li>
          <li>Preservar a memória intelectual da Universidade;</li>
          <li>Reunir em um único local virtual e de forma permanente a produção científica e institucional;</li>
          <li>Disponibilizar o livre acesso aos conteúdos digitais;</li>
          <li>Ampliar e facilitar o acesso à produção científica de uma forma geral.</li>
        </ul>

        <div className="search-container">
          <input
            type="text"
            placeholder="Pesquisar por título, autor, ano ou tipo de material..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="resultados-container">
          <table className="tabela-arquivos">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Ano</th>
                <th>Tipo de Material</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map(arquivo => (
                  <React.Fragment key={arquivo.id}>
                    <tr>
                      <td>{arquivo.titulo || 'Título desconhecido'}</td>
                      <td>{arquivo.autor || 'Autor desconhecido'}</td>
                      <td>{arquivo.ano || 'Ano desconhecido'}</td>
                      <td>{arquivo.tipoArquivo || 'Desconhecido'}</td>
                      <td>
                        <button onClick={() => toggleRow(arquivo.id)}>
                          {expandedRow === arquivo.id ? 'Fechar' : 'Detalhes'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === arquivo.id && (
                      <tr>
                        <td colSpan="5">
                          <div className="arquivo-detalhes">
                            <p><strong>Descrição:</strong> {arquivo.descricao || 'Descrição não disponível'}</p>
                            <a href={arquivo.arquivo} target="_blank" rel="noopener noreferrer">Abrir Arquivo</a>
                            <div className="detalhe-acoes">
                              {arquivo.usuarioId === user.uid && ( 
                                <>
                                  <button onClick={() => navigate(`/edit-materiais/${arquivo.id}`)}>
                                    Alterar
                                  </button>
                                  <button onClick={() => handleDelete(arquivo.id)}>
                                    Excluir
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Nenhum arquivo encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Anterior</button>
          <span>Página {currentPage} de {Math.ceil(filteredArquivos.length / itemsPerPage)}</span>
          <button onClick={handleNextPage} disabled={currentPage >= Math.ceil(filteredArquivos.length / itemsPerPage)}>Próxima</button>
        </div>

        <div className="icons-container">
          <div className="icon" onClick={() => navigate('/livros-prof')}> 
            <img src={livros} alt="Livros" />
            <span>Livros</span>
          </div>
          <div className="icon" onClick={() => navigate('/materiais-prof')}> 
            <img src={materiais} alt="Materiais" />
            <span>Materiais</span>
          </div>
          <div className="icon" onClick={() => navigate('/tccs-prof')}> 
            <img src={artigos} alt="Artigos" />
            <span>Artigos</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfessorDashboard;