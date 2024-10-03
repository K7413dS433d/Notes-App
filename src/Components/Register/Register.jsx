import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector, useStore } from "react-redux";
import { register } from "../../Redux/Slices/registerSlice";
import registerImg from "../../assets/register.png";

//initial values
const initialValues = {
  name: "",
  age: "",
  phone: "",
  email: "",
  password: "",
};

//validation schema
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is Required")
    .min(3, "Minimum Characters is 3")
    .max(20, "Maximum Characters is 20"),
  age: yup
    .number()
    .typeError("Age must be a valid number")
    .required("Age is required")
    .integer("age must be integer")
    .moreThan(10, "Age must be 10+")
    .lessThan(100, "Age must be less than 100"),
  phone: yup
    .string()
    .required("Number is required")
    .matches(/^01[1250][0-9]{8}$/, "Enter Egyptian number"),
  email: yup.string().required("Email is Required").email("Enter valid email"),
  password: yup
    .string()
    .required("Password is Required")
    .matches(
      /^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=\[\]{}|;:'",.<>?\\\/`~]).{8,16}$/,
      "Password contains lowercase, uppercase, digit, symbol, 8-16 chars, no spaces."
    ),
});

function Register() {
  const store = useStore();
  const navigator = useNavigate();
  const { loading } = useSelector((state) => state.registerReducer);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(register(values)).then(() => {
        const { success, error } = store.getState().registerReducer;
        if (success) {
          toast.success("Your account has been created successfully!", {
            toastId: "registered",
            autoClose: 3000,
          });
          setTimeout(() => {
            navigator("/login");
          }, 2000);
        } else if (error) {
          toast.error(error, {
            toastId: "errorRegistered",
          });
        }
      });
    },
  });

  return (
    <section className="bg-primary min-h-screen p-5 md:p-10 flex items-stretch justify-center">
      <div className="bg-white p-5 rounded-3xl grid  lg:grid-cols-2  relative">
        <p className="md:ms-7 text-lg text-gray-400 font-semibold absolute top-0  left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 md:-top-7 ">
          Docket
        </p>

        {/* image  */}
        <div className="flex justify-center items-center lg:order-2 mb-5">
          <img src={registerImg} alt="login image" className="xl:w-[70%] " />
        </div>

        {/* form   */}
        <div className="flex flex-col justify-center md:px-10 md:order-1 h-full lg:relative">
          <h1 className="text-2xl sm:text-5xl  md:text-5xl lg:text-6xl font-bold  absolute top-3 lg:top-0 md:left-3 ">
            Register
          </h1>

          <form
            onSubmit={formik.handleSubmit}
            className="  flex flex-col justify-center gap-6"
          >
            <div className="flex gap-5">
              <div className="flex-1 relative">
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  className="w-full h-10 sm:h-11 rounded-full focus:outline-none border-2 px-3 border-Charcoal"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                {formik.errors.name && formik.touched.name ? (
                  <>
                    <i className=" absolute top-[50%] -translate-y-[50%] right-2 fa-solid fa-circle-exclamation text-red-700"></i>
                    <p className="absolute text-red-700 left-2 text-sm ">
                      {formik.errors.name}
                    </p>
                  </>
                ) : null}
              </div>
              <div className="relative">
                <input
                  name="age"
                  type="text"
                  maxLength="3"
                  placeholder="age"
                  className="w-12 lg:w-16 2xl:w-20 h-10 sm:h-11 rounded-full focus:outline-none border-2 px-2 border-Charcoal text-center"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.age}
                />
                <p
                  className={`${
                    formik.errors.age && formik.touched.age
                      ? "opacity-1"
                      : "opacity-0"
                  } duration-700 absolute -top-16  -translate-x-[75%] sm:-top-20 sm:-translate-x-[80%] text-red-700 bg-[#cecece] p-2 rounded-xl  w-36 h-12 sm:w-52 sm:h-16 text-xs sm:text-sm `}
                >
                  {formik.errors.age}
                  <i className="absolute right-2 -bottom-2 fa-solid fa-caret-down fa-xl sm:fa-2x text-red-800"></i>
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                name="phone"
                type="text"
                placeholder="Phone Number"
                className="w-full h-10 sm:h-11 rounded-full focus:outline-none border-2 px-3 border-Charcoal"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phone}
              />
              {formik.errors.phone && formik.touched.phone ? (
                <>
                  <i className=" absolute top-[50%] -translate-y-[50%] right-2 fa-solid fa-circle-exclamation text-red-700"></i>
                  <p className="absolute text-red-700 left-2 text-sm ">
                    {formik.errors.phone}
                  </p>
                </>
              ) : null}
            </div>
            <div className="relative">
              <input
                name="email"
                type="text"
                placeholder="Email"
                className="w-full h-10 sm:h-11 rounded-full focus:outline-none border-2 px-3 border-Charcoal"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email ? (
                <>
                  <i className=" absolute top-[50%] -translate-y-[50%] right-2 fa-solid fa-circle-exclamation text-red-700"></i>
                  <p className="absolute text-red-700 left-2 text-sm ">
                    {formik.errors.email}
                  </p>
                </>
              ) : null}
            </div>
            <div className="relative">
              <input
                name="password"
                type="text"
                placeholder="Password"
                className="w-full h-10 sm:h-11 rounded-full focus:outline-none border-2 px-3 border-Charcoal"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.errors.password && formik.touched.password ? (
                <>
                  <i className=" absolute top-[50%] -translate-y-[50%] right-2 fa-solid fa-circle-exclamation text-red-700"></i>
                  <p className="absolute text-red-700 left-2 text-sm ">
                    {formik.errors.password}
                  </p>
                </>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full h-12 rounded-full font-semibold text-xl text-white  bg-Charcoal mt-5 hover:text-Charcoal hover:bg-custom-gradient duration-500 "
            >
              {loading ? (
                <i className="fa-solid fa-spin fa-spinner fa-lg text-white"></i>
              ) : (
                "Register"
              )}
            </button>
          </form>
          <p className="px-5 py-1">
            Have an account? &nbsp;
            <NavLink
              to="/login"
              className="bg-clip-text text-transparent bg-custom-gradient"
            >
              Login here
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
