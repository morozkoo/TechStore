import Button from '../ui/Button';

function ShoppingCart({ items, onRemoveFromCart, onClearCart }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="shopping-cart">
      <h2>Корзина ({items.length})</h2>
      {items.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <span>{item.name}</span>
              <span>
                ${item.price} x {item.quantity}
              </span>
              <Button onClick={() => onRemoveFromCart(item.id)} variant="danger">
                Удалить
              </Button>
            </div>
          ))}
          <div className="cart-total">
            <strong>Итого: ${total}</strong>
          </div>
          <Button onClick={onClearCart}>Очистить корзину</Button>
        </>
      )}
    </div>
  );
}

export default ShoppingCart;
