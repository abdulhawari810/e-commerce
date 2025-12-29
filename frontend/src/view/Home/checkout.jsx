import { useCart } from "../../context/cartCountext";

export default function Checkout() {
  const { dataCart, setDataCart } = useCart();

  console.log(dataCart);
  return (
    <>
      <h1>Checkout</h1>
    </>
  );
}
