import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Projetos.css';
import './Princ.css';
import Header from './Header';
import { useAuth } from './context/useAuth';
import { useCart } from './context/useCart';

export interface Projeto {
  id: number;
  titulo: string;
  arquiteto: string;
  estilo: string;
  localizacao: string;
  imagens: string[];
}

const projetosData: Projeto[] = [
  {
    id: 1,
    titulo: "Residência Horizon",
    arquiteto: "Arq. Sophia Martins",
    estilo: "Minimalista",
    localizacao: "São Paulo, SP",
    imagens: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: 2,
    titulo: "Loft Industrial Urban",
    arquiteto: "Studio Lucas & Co.",
    estilo: "Industrial",
    localizacao: "Curitiba, PR",
    imagens: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: 3,
    titulo: "Casa das Árvores",
    arquiteto: "Arq. Beatriz Lima",
    estilo: "Contemporâneo",
    localizacao: "Rio de Janeiro, RJ",
    imagens: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop"
    ]
  }
];

// Componente individual para cada Card com seu próprio estado de carrossel
const CardProjeto: React.FC<{ projeto: Projeto }> = ({ projeto }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const { isAuthenticated } = useAuth();
  const { addItem, items } = useCart();
  const navigate = useNavigate();
  const isInCart = items.some((item) => item.projectId === projeto.id);

  const prevImage = () => {
    setCurrentImgIndex((prev) =>
      prev === 0 ? projeto.imagens.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImgIndex((prev) =>
      prev === projeto.imagens.length - 1 ? 0 : prev + 1
    );
  };

  const addToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: '/projetos', pendingProjectId: projeto.id },
      });
      return;
    }

    addItem({
      projectId: projeto.id,
      title: projeto.titulo,
      image: projeto.imagens[0],
    });
  };

  return (
    <div className="projeto-card">
      <div className="carrossel-container">
        <img
          src={projeto.imagens[currentImgIndex]}
          alt={`${projeto.titulo} - Foto ${currentImgIndex + 1}`}
          className="carrossel-img"
        />

        <button className="carrossel-btn prev" onClick={prevImage} aria-label="Imagem anterior">
          ❮
        </button>
        <button className="carrossel-btn next" onClick={nextImage} aria-label="Próxima imagem">
          ❯
        </button>

        <div className="carrossel-dots">
          {projeto.imagens.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === currentImgIndex ? 'active' : ''}`}
              onClick={() => setCurrentImgIndex(idx)}
            />
          ))}
        </div>
      </div>

      <div className="projeto-info">
        <div className="projeto-tags-container">
          <span className="estilo-tag">{projeto.estilo}</span>
          <span className="local-tag">{projeto.localizacao}</span>
        </div>

        <h3>{projeto.titulo}</h3>
        <span className="arquiteto-nome">{projeto.arquiteto}</span>

        <button className="btn-detalhes" type="button">Ver Projeto</button>
        <button
          className="btn-carrinho"
          type="button"
          onClick={addToCart}
          disabled={isInCart}
        >
          {isInCart ? 'No carrinho' : 'Adicionar ao carrinho'}
        </button>
      </div>
    </div>
  );
};

const Projetos: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pendingProjectId = (location.state as { pendingProjectId?: number } | null)
      ?.pendingProjectId;
    const pendingProject = projetosData.find((project) => project.id === pendingProjectId);

    if (isAuthenticated && pendingProject) {
      addItem({
        projectId: pendingProject.id,
        title: pendingProject.titulo,
        image: pendingProject.imagens[0],
      });
      navigate('/projetos', { replace: true, state: null });
    }
  }, [addItem, isAuthenticated, location.state, navigate]);
  return (
    <>
      <Header className="navbar-projetos" />

      <section id="projetos" className="projetos-container">
        <div className="projetos-content">
          <div className="projetos-header">
            <span className="projetos-tag">Inspire-se</span>
            <h2>Explore projetos criados por <strong>nossos arquitetos</strong>.</h2>
          </div>

          <div className="projetos-grid">
            {projetosData.map((projeto) => (
              <CardProjeto key={projeto.id} projeto={projeto} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Projetos;