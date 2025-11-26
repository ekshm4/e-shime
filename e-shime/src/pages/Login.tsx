import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { setToken } from "../lib/auth";
import { API_BASE } from "../lib/config";

interface LoginProps {
  darkMode: boolean;
}

export function Login({ darkMode }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // ✅ validate email + password before sending
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ call backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "Invalid credentials." });
        return;
      }

      // Save token and user
      setToken(data.token);
      localStorage.setItem("eshime_user", JSON.stringify(data.user));
      localStorage.setItem("user_Id", JSON.stringify(data.user.id));

      navigate("/dashboard");
    } catch (error: unknown) {
      setErrors({
        general: `Server error. Please try again. ${
          error instanceof Error ? error.message : ""
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-[#F5F5DC]"
      } flex items-center justify-center px-4 py-12 transition-colors duration-300`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-xl p-8 w-full max-w-md`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Heart
              className={`h-10 w-10 ${darkMode ? "text-beige" : "text-black"} fill-current`}
            />
            <div>
              <h2 className={`${darkMode ? "text-white" : "text-black"}`}>E-SHIME</h2>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Healing through Expression
              </p>
            </div>
          </div>
        </div>

        <h3 className={`text-center ${darkMode ? "text-white" : "text-black"} mb-6`}>
          Welcome Back
        </h3>

        {errors.general && (
          <p className="text-red-500 text-sm mb-2 text-center">{errors.general}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className={darkMode ? "text-gray-300" : "text-gray-700"}>
              Email or Username
            </Label>
            <Input
              id="email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className={`mt-1 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50"}`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="password" className={darkMode ? "text-gray-300" : "text-gray-700"}>
              Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`pr-10 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50"}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className={`text-sm ${darkMode ? "text-beige hover:text-beige/80" : "text-gray-700 hover:text-black"}`}
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full ${darkMode ? "bg-beige text-black hover:bg-beige/90" : "bg-black text-white hover:bg-black/90"}`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className={`mt-6 text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className={`${darkMode ? "text-beige hover:text-beige/80" : "text-black hover:text-gray-700"}`}
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className={`mt-8 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} text-center`}>
            <strong>Demo Credentials:</strong>
            <br />
            User: any email / any password
            <br />
            Admin: admin@eshime.rw / admin
          </p>
        </div>

        <div className={`mt-6 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} italic`}>
          "You are not alone. Your journey matters."
        </div>
      </motion.div>
    </div>
  );
}
