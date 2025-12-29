export default function Card({ styles, children }) {
  return (
    <>
      <div
        className={`${
          styles || "w-full flex gap-5 p-5 flex-nowrap overflow-auto"
        }`}
      >
        {children}
      </div>
    </>
  );
}
