import { GoogleLogin } from "@react-oauth/google";
import googleIcon from "../assets/images/icon-google.webp";
import Github from "../assets/images/github.svg";

function SocialLogin({ onGoogleSuccess }) {
  function handleGoogleSuccess(response) {
    console.log(response);

    if (onGoogleSuccess) {
      onGoogleSuccess(response);
    }
  }

  function handleGoogleError() {
    console.log("Google Login Failed");
  }

  return (
    <div className="login_option flex gap_sm">
      {/* Google Login */}
      <div className="social_btn">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          size="large"
          text="continue_with"
        />
      </div>

      {/* Github Button */}
      {/* <button
        type="button"
        className="with_google radius border bg_white"
      >
        <img src={Github} alt="Github" />
        Github
      </button> */}
    </div>
  );
}

export default SocialLogin;