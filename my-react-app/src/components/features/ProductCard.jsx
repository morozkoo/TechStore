import Button from '../ui/Button';
import Rating from '../ui/Rating';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <Rating value={product.rating} />
      <p className="price">${product.price}</p>
      <Button onClick={() => onAddToCart(product)}>В корзину</Button>
    </div>
  );
}

export default ProductCard;
