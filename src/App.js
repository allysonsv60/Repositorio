import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cadastro from './components/Auth/Cadastro';
import Login from './components/Auth/Login';
import AlunoDashboard from './components/AlunoDashboard';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';
import FormularioArquivo from './components/Arquivos/FormularioArquivo';
import ListaArquivos from './components/Arquivos/ListaArquivos';
import ListaArquivosAdmin from './components/Arquivos/ListaArquivosAdmin';
import Sobre from './components/Sobre';
import './App.css';
import logo from './img/faeterj.gif';
import ProfessorDashboard from './components/ProfessorDashboard';
import Contato from './components/Contato';
import DuvidasFrequentes from './components/DuvidasFrequentes';
import MeusEnvios from './components/MeusEnvios';
import ListaArquivosProf from './components/Arquivos/ListaArquivosProf';

const App = () => {
  return (
    <Router>
      <header className="top-bar">
        <div className="container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
      </header>

      <div className="main-content">
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/duvidas-frequentes" element={<DuvidasFrequentes />} />
          <Route path="/meus-envios" element={<MeusEnvios />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-aluno" element={<AlunoDashboard />} />
          <Route path="/dashboard-adm" element={<AdminDashboard />} />
          <Route path="/dashboard-professor" element={<ProfessorDashboard />} />

          
          <Route path="/tccs" element={<ListaArquivos tipoArquivo="tccs" />} />
          <Route path="/tccs-adm" element={<ListaArquivosAdmin tipoArquivo="tccs" />} />
          <Route path="/tccs-prof" element={<ListaArquivosProf tipoArquivo="tccs" />} />
          <Route path="/add-tccs" element={<FormularioArquivo tipoArquivo="tccs" />} />
          <Route path="/edit-tccs/:id" element={<FormularioArquivo tipoArquivo="tccs" />} />

          
          <Route path="/livros" element={<ListaArquivos tipoArquivo="livros" />} />
          <Route path="/livros-adm" element={<ListaArquivosAdmin tipoArquivo="livros" />} />
          <Route path="/livros-prof" element={<ListaArquivosProf tipoArquivo="livros" />} />
          <Route path="/add-livros" element={<FormularioArquivo tipoArquivo="livros" />} />
          <Route path="/edit-livros/:id" element={<FormularioArquivo tipoArquivo="livros" />} />

          
          <Route path="/materiais" element={<ListaArquivos tipoArquivo="materiais_complementares" />} />
          <Route path="/materiais-adm" element={<ListaArquivosAdmin tipoArquivo="materiais_complementares" />} />
          <Route path="/materiais-prof" element={<ListaArquivosProf tipoArquivo="materiais_complementares" />} />
          <Route path="/add-materiais_complementares" element={<FormularioArquivo tipoArquivo="materiais_complementares" />} />
          <Route path="/edit-materiais_complementares/:id" element={<FormularioArquivo tipoArquivo="materiais_complementares" />} />
          
          
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;