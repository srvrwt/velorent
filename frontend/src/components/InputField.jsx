import { useState } from "react";
import EyeIcon from "../assets/icons/icon-visibility.svg";
import EyeOffIcon from "../assets/icons/icon-visibility-off.svg";

function InputField({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div>
      <label>
        {label}
        {error && <span className="error">{error}</span>}
      </label>

      <div className="input_wrapper">
        <input
          type={isPassword && showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

        {isPassword && (
          <span
            type="button"
            className="password_toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            <img
              src={showPassword ? EyeOffIcon : EyeIcon}
              alt={showPassword ? "Hide password" : "Show password"}
            />
          </span>
        )}
      </div>
    </div>
  );
}

export default InputField;