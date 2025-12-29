export const getGuestCart = () => {
  return JSON.parse(localStorage.getItem("carts")) || [];
};

export const setGuestCart = (cart) => {
  localStorage.setItem("carts", JSON.stringify(cart));
};

export const getGuestCount = () => {
  const cart = getGuestCart();
  return cart.length;
};
