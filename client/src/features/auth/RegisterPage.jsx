import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!avatar) {
            setError("Avatar is required.");
            return;
        }

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("avatar", avatar);

        try {
            await register(formData);
            navigate("/login");
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed. Check your details and try again.";
            setError(message);

        }
    };

    return (
        <div className="auth-wrap">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Register</h2>
                {error && <p className="error-text">{error}</p>}
               <div className="field">
                <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                </div>
               <div className="field">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div> 
                <div className="field">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
</div>
                <div className="field">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
</div>
                <div className="field">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                />
                </div>
                <button className="btn btn-primary" type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;