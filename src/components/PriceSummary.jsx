function PriceSummary({
  basePrice,
  bodyPrice,
  wheelPrice,
  glassPrice,
}) {

  const totalPrice =
    basePrice +
    bodyPrice +
    wheelPrice +
    glassPrice;

  return (
    <div className="price-section">

      <p>
        <span>Base Price</span>
        <span>
          ₹{basePrice.toLocaleString("en-IN")}
        </span>
      </p>

      <p>
        <span>Body</span>
        <span>
          +₹{bodyPrice.toLocaleString("en-IN")}
        </span>
      </p>

      <p>
        <span>Wheels</span>
        <span>
          +₹{wheelPrice.toLocaleString("en-IN")}
        </span>
      </p>

      <p>
        <span>Glass</span>
        <span>
          +₹{glassPrice.toLocaleString("en-IN")}
        </span>
      </p>

      <hr />

      <h2>
        <span>Total</span>
        <span>
          ₹{totalPrice.toLocaleString("en-IN")}
        </span>
      </h2>

    </div>
  );
}

export default PriceSummary;