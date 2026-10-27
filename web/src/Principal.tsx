import React, { useState } from 'react';
import './Princ.css';
import Header from './Header';

const Index: React.FC = () => {
  const [cidade, setCidade] = useState('');
  const [estilo, setEstilo] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="hero-header">
      <div className="bg-animated" />

      <div className="hero-overlay">
        <Header />

        <div className="hero-content">
          <div className="hero-title-container">
            <h1>A ARQUITETURA É A ARTE DE <strong>DESENHAR SONHOS</strong></h1>
          </div>

          <div className="search-container">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="input-group">
                <label htmlFor="local">Localização</label>
                <input
                  type="text"
                  id="local"
                  placeholder="Cidade..."
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="estilo">Projeto</label>
                <select
                  id="estilo"
                  value={estilo}
                  onChange={(e) => setEstilo(e.target.value)}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                  <option value="interiores">Interiores</option>
                </select>
              </div>

              <button type="submit" className="search-btn">
                Buscar
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Index;