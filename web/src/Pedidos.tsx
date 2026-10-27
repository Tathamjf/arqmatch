import Header from './Header';
import './Pedidos.css';
import { useAuth } from './context/useAuth';
import { orderService } from './services/orders';
import type { Order } from './types/domain';

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));

function Pedidos() {
  const { currentUser } = useAuth();
  const orders: Order[] = currentUser ? orderService.getForUser(currentUser.id) : [];

  return (
    <main className="orders-page">
      <Header />
      <section className="orders-content" aria-labelledby="orders-title">
        <h1 id="orders-title">Meus pedidos</h1>

        {orders.length === 0 ? (
          <p className="orders-empty">Você ainda não registrou nenhum pedido.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-header">
                  <div>
                    <h2>Pedido {order.id}</h2>
                    <p>{formatDate(order.createdAt)}</p>
                  </div>
                  <span className="order-status">{order.status}</span>
                </div>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.projectId}>
                      {item.title} — quantidade: {item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="orders-empty">
                  Este registro local não possui valor financeiro, pois os projetos não têm preço cadastrado.
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Pedidos;
