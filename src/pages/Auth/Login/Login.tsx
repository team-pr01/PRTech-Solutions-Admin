/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useState } from "react";
import { useLoginMutation } from "../../../redux/Features/Auth/authApi";
import { setUser } from "../../../redux/Features/Auth/authSlice";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import PasswordInput from "../../../components/Reusable/PasswordInput/PasswordInput";
import Button from "../../../components/Reusable/Button/Button";
import { ICONS, IMAGES } from "../../../assets";

type TFormData = {
  email: string;
  password: string;
};
const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormData>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSigIn = async (data: TFormData) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };
      const res = await login(payload).unwrap();
      if (res?.success) {
        dispatch(
          setUser({ user: res?.data?.user, token: res?.data?.accessToken }),
        );
      }
      if (res?.data?.user?.role === "admin") {
        navigate("/dashboard/admin/home");
      } else if (res?.data?.user?.role === "staff") {
        navigate("/dashboard/staff/leads");
      } else {
        navigate("/");
      }
      reset();
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || "Login failed. Please try again.");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50/20 px-4">
      <form
        onSubmit={handleSubmit(handleSigIn)}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center gap-6 font-Nunito border border-primary-10/20"
      >
        <img src={IMAGES.logo} alt="" className="w-40" />
        {/* Email */}
        <TextInput
          label="Email"
          placeholder="Enter your email"
          type="email"
          error={errors.email}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />

        <PasswordInput
          label="Password"
          placeholder="Must be at least 8 Characters"
          error={errors.password}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          isPasswordVisible={isPasswordVisible}
          setIsPasswordVisible={setIsPasswordVisible}
        />

        <Button
          type="submit"
          label="Log In"
          variant="primary"
          iconWithoutBg={ICONS.topRightArrowWhite}
          className="py-2 lg:py-2 w-full md:w-fit"
          isLoading={isLoading}
          isDisabled={isLoading}
        />
      </form>
    </div>
  );
};

export default Login;
