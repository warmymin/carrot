// components/ProductCard.jsx
export default function ProductCard({ product }) {
  return (
    <div className="border p-4 rounded shadow">
      <img src={product.image} alt={product.title} className="w-full h-40 object-cover mb-2" />
      <h2 className="text-lg font-bold">{product.title}</h2>
      <p>{product.desc}</p>
      <p className="text-blue-500">{product.price}원</p>
    </div>
  );
}
