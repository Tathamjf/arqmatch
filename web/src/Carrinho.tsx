import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import './Carrinho.css';
import { useCart } from './context/useCart';
import { useAuth } from './context/useAuth';
import { orderService } from './services/orders';

function Carrinho() {
  const { items, removeItem } = useCart();
  const { clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateOrder = () => {
    if (!currentUser || items.length === 0) {
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      orderService.create(currentUser.id, items);
      clearCart();
      navigate('/pedidos');
    } catch (orderError) {
      setError(
        orderError instanceof Error
          ? orderError.message
          : 'Não foi possível registrar o pedido.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="cart-page">
      <Header />
      <section className="cart-content" aria-labelledby="cart-title">
        <h1 id="cart-title">Meu carrinho</h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Seu carrinho está vazio.</p>
            <Link className="cart-link" to="/projetos">
              Continuar explorando projetos
            </Link>
          </div>
        ) : (
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item.projectId}>
                {item.image && <img src={item.image} alt="" />}
                <div className="cart-item-info">
                  <h2>{item.title}</h2>
                  <p>Quantidade: {item.quantity}</p>
                  <p>Preço não informado para este projeto.</p>
                </div>
                <button
                  className="cart-remove"
                  type="button"
                  onClick={() => removeItem(item.projectId)}
                >
                  Remover
                </button>
              </article>
            ))}
            <p className="cart-empty">
              Os projetos atuais não possuem preço cadastrado. Nenhum total financeiro foi calculado.
            </p>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button
              className="auth-submit"
              type="button"
              onClick={handleCreateOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar pedido'}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Carrinho;
