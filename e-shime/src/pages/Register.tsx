import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { API_BASE } from "../lib/config";

interface RegisterProps {
  darkMode: boolean;
}

export function Register({ darkMode }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  // ✅ validate input
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";

    if (!formData.password) newErrors.password = "Password is required";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Failed to register. Try again.");
        return;
      }

      navigate("/login");
    } catch (err) {
      setServerError("Server error. Please try again later.");
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
          Start Your Healing Journey
        </h3>

        {serverError && (
          <p className="text-red-500 text-sm text-center mb-3">{serverError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <Label htmlFor="name" className={darkMode ? "text-gray-300" : "text-gray-700"}>
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              className={`mt-1 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50"}`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className={darkMode ? "text-gray-300" : "text-gray-700"}>
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className={`mt-1 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50"}`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
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
                placeholder="Create a strong password"
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

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className={darkMode ? "text-gray-300" : "text-gray-700"}>
              Confirm Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`pr-10 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50"}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className={`w-full ${darkMode ? "bg-beige text-black hover:bg-beige/90" : "bg-black text-white hover:bg-black/90"}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <div className={`mt-6 text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className={`${darkMode ? "text-beige hover:text-beige/80" : "text-black hover:text-gray-700"}`}>
              Login
            </Link>
          </p>
        </div>

        <div className={`mt-6 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} text-center`}>
            <strong>Your Privacy Matters:</strong><br />
            We respect your anonymity. You can choose to remain anonymous in all support interactions.
          </p>
        </div>

        <div className={`mt-6 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} italic`}>
          "Every journey begins with a single step. Welcome."
        </div>
      </motion.div>
    </div>
  );
}
