import { useCart } from "../../context/cartCountext";

export default function Orders() {
  const { dataCart, setDataCart } = useCart();

  console.log(dataCart);
  return (
    <>
      <h1>Orders</h1>
    </>
  );
}
