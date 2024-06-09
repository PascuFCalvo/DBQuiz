import "./JavaScriptLogo.css";
import DBZImage from "../src/assets/dbz.png";  // Importa la imagen

export const JavascriptLogo = () => {
    return (
        <img src={DBZImage} alt="JavaScript Logo" />  // Usa la imagen importada
    );
}
