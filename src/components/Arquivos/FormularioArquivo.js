import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../database/firebase';
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";

const FormularioArquivo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ano, setAno] = useState('');
  const [autor, setAutor] = useState('');
  const [tipoArquivo, setTipoArquivo] = useState('artigo'); 
  const [arquivo, setArquivo] = useState(null);
  const [urlArquivo, setUrlArquivo] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [user, loading] = useAuthState(auth);

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
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUsuario();
  }, [user, db, navigate]);

  useEffect(() => {
    if (id) {
      const fetchArquivo = async () => {
        const docRef = doc(db, 'arquivos', id); 
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitulo(data.titulo);
          setDescricao(data.descricao);
          setAno(data.ano || ''); 
          setAutor(data.autor || ''); 
          setUrlArquivo(data.arquivo || '');
          setTipoArquivo(data.tipoArquivo || 'artigo');
        }
      };
      fetchArquivo();
    }
  }, [id]);

  const handleFileChange = (e) => {
    setArquivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let arquivoUrl = urlArquivo;

      if (arquivo) {
        const fileRef = ref(storage, `arquivos/${arquivo.name}`); 
        await uploadBytes(fileRef, arquivo);
        arquivoUrl = await getDownloadURL(fileRef);
      }

      const dadosArquivo = { 
        titulo, 
        descricao, 
        ano, 
        autor, 
        arquivo: arquivoUrl, 
        autorId: user.uid,
        tipoArquivo 
      }; 

      if (id) {
        await updateDoc(doc(db, 'arquivos', id), dadosArquivo); 
        alert('Arquivo atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'arquivos'), dadosArquivo); 
        alert('Arquivo adicionado com sucesso!');
      }
      
      if (usuario === 'professor') {
        navigate(`/dashboard-professor`);
      } else if (usuario === 'admin') {
        navigate(`/dashboard-adm`);
      }
    } catch (error) {
      console.error("Erro ao salvar o arquivo: ", error);
      alert("Erro ao salvar o arquivo.");
    }
  };

  const handleVoltar = () => {
    navigate(-1); 
  };

  return (
    <div className="container-table">
      <form onSubmit={handleSubmit} className="formulario-arquivo">
        <table className="form-table">
          <tbody>
            <tr>
              <td><label htmlFor="titulo">Título</label></td>
              <td>
                <input
                  type="text"
                  id="titulo"
                  placeholder="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </td>
            </tr>

            <tr>
              <td><label htmlFor="descricao">Descrição</label></td>
              <td>
                <textarea
                  id="descricao"
                  placeholder="Descrição"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  className="descricao-box" 
                  maxLength="500"  
                />
              </td>
            </tr>

            <tr>
              <td><label htmlFor="ano">Ano</label></td>
              <td>
                <input
                  type="number"
                  id="ano"
                  placeholder="Ano"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  required
                />
              </td>
            </tr>

            <tr>
              <td><label htmlFor="autor">Autor</label></td>
              <td>
                <input
                  type="text"
                  id="autor"
                  placeholder="Autor"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  required
                />
              </td>
            </tr>

            <tr>
              <td><label htmlFor="tipoArquivo">Tipo de Arquivo</label></td>
              <td>
                <select id="tipoArquivo" value={tipoArquivo} onChange={(e) => setTipoArquivo(e.target.value)}>
                  <option value="artigo">Artigo</option>
                  <option value="livro">Livro</option>
                  <option value="materialComplementar">Material Complementar</option>
                </select>
              </td>
            </tr>

            <tr>
              <td><label htmlFor="arquivo">Arquivo</label></td>
              <td>
                <input type="file" id="arquivo" onChange={handleFileChange} />
                {urlArquivo && (
                  <p>Arquivo atual: <a href={urlArquivo} target="_blank" rel="noopener noreferrer">Visualizar</a></p>
                )}
              </td>
            </tr>

            <tr>
              <td colSpan="2" className="text-center">
                <div className="button-group">
                  <button type="submit" className="btn-salvar">Salvar</button> 
                  <button type="button" onClick={handleVoltar} className="btn-voltar">Voltar</button> 
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default FormularioArquivo;
