const Square = ({ colorValue, index }) => {
  return (
    <section className="square" style={{ backgroundColor: colorValue }}>
      <p>{index !== undefined ? `Box ${index}` : "empty"}</p>
    </section>
  );
};

Square.defaultProps = {
  colorValue: "empty",
  index: undefined, // Default index is undefinedyellow
};

export default Square;