import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext.jsx"
import { login } from "../api/AuthApi.js"

const loginSchema = z.object({
    username: z
        .string()
        .regex(/^[a-zA-Z0-9]{3,15}$/, "Username must contain 3-15 letters or numbers"),

    password: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
            "Password must contain uppercase, lowercase, number and special symbol"
        )
});

function Login() {

    const navigate = useNavigate();
    const {login:save} = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    async function onSubmit(data) {
        try {
            // MOCK API REQUEST
            let response = await login(data);
            save(response.data);

            if (response.data.user.role === "operator") {
                navigate("/OperatorHomePage");
            }
            else {
                navigate("/ClientHomePage");
            }
        }
        catch (error) {
            setError("root", {
                message:
                    error.message
            });
        }
    }

    return (
        <div className="login-scene">

            <form
                className="login-card"
                onSubmit={handleSubmit(onSubmit)}
            >

                <div className="login-header">
                    <p className="login-title">Form</p>

                    <p className="login-subtitle">
                        Enter your data to access the service
                    </p>
                </div>

                <div className="login-fields">

                    <div className="field-group">

                        <label
                            className="field-label"
                            htmlFor="username"
                        >
                            Login
                        </label>

                        <input
                            {...register("username")}
                            className="login-input"
                            id="username"
                            type="text"
                            placeholder="your_username"
                        />

                    </div>

                    <div className="field-group">

                        <label
                            className="field-label"
                            htmlFor="password"
                        >
                            Password
                        </label>

                        <input
                            {...register("password")}
                            className="login-input"
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />

                    </div>

                    {(errors.root || errors.username || errors.password) && (
                        <div className="error-box">

                            <p className="error-box-text">
                                {errors.root? errors.root.message : errors.username? errors.username.message : errors.password.message}
                            </p>

                        </div>
                    )}

                    <button
                        className="submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Loading..." : "Login"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default Login;