function FormButton({
  text,
  type = "submit",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`form_btn ${className}`}
    >
      {text}
    </button>
  );
}

export default FormButton;