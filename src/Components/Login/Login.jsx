import { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { login } from "../../Redux/Slices/loginSlice";
import loginImg from "../../assets/login.png";

//formik initial values
const initialValues = {
  email: "",
  password: "",
};

//formik validation schema
const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

function Login() {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.loginReducer);
  const store = useStore();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      dispatch(login(values)).then(() => {
        const { success, error } = store.getState().loginReducer; // Destructuring
        // handle result here
        if (success) {
          toast.success("Login Success", {
            toastId: "loggedIn",
            autoClose: 3000,
          });
          setTimeout(() => navigator("/"), 2000);
        } else if (error) {
          toast.error(error, { toastId: "errorLogin" });
        }
      });
    },
  });

  useEffect(() => {
    const { email, password } = formik.errors;
    if (email || password) {
      email && toast.error(email, { toastId: "EmailError", autoClose: 1500 });
      password &&
        toast.error(password, { toastId: "PasswordError", autoClose: 1500 });
    }
  }, [formik.isSubmitting]);

  return (
    <section className="bg-primary min-h-screen p-5 md:p-10 overflow-hidden flex items-stretch justify-center">
      <div className="bg-white p-5 rounded-3xl grid  lg:grid-cols-2 relative">
        <p className="md:ms-7 text-lg text-gray-400 font-semibold absolute top-0  left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 md:-top-7 ">
          Docket
        </p>

        {/* image  */}
        <div className="flex justify-center items-center lg:order-2 ">
          <img src={loginImg} alt="login image" className="xl:w-[80%] " />
        </div>

        {/* form   */}
        <div className="flex flex-col justify-center md:px-10 md:order-1 h-full lg:relative">
          <h1 className="text-3xl sm:text-5xl  md:text-5xl lg:text-6xl font-bold  absolute top-5 ">
            Login
          </h1>

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col justify-center gap-6"
          >
            <div>
              <input
                name="email"
                type="text"
                placeholder="Email"
                className="w-full h-10 sm:h-11 rounded-full focus:outline-none border-2 px-3 border-Charcoal"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </div>
            <div>
              <input
                name="password"
                type="text"
                placeholder="Password"
                className="w-full h-10 sm:h-11 rounded-full focus:outline-none border-2 px-3 border-Charcoal"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 rounded-full font-semibold text-xl text-white  bg-Charcoal mt-5 hover:text-Charcoal hover:bg-custom-gradient duration-500 "
            >
              {loading ? (
                <i className="fa-solid fa-spin fa-spinner fa-lg text-white"></i>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <p className="p-5">
            Don&#39;t have an account yet? &nbsp;
            <NavLink
              to="/register"
              className="bg-clip-text text-transparent bg-custom-gradient"
            >
              Sign up here
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
