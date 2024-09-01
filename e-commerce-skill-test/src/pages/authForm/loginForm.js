import styles from "./AuthForm.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { signinApiAsync, authSelector } from "../../redux/authReducer";
import { loadingSelector } from "../../redux/loadingReducer";
import { useSelector, useDispatch } from "react-redux";
import { ClipLoader} from "react-spinners";
import { toast } from "react-toastify";
import { errorSelector,clearError } from "../../redux/errorReducer";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
 // other hooks and state variables
 const navigate = useNavigate();
 const location = useLocation();
 const from = location.state?.from?.pathname || "/";

  // ========= getting states from reducers by selector =========//
  const {loading} = useSelector(loadingSelector);
  const { errorMessage} = useSelector(errorSelector);
  const {isLoggedIn} = useSelector(authSelector);


  // ======= showing error toast if any login error ======//
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, dispatch]);

  //========= if loggedIn successfully then redirect to the home page ====//
  useEffect(() => {
    if (isLoggedIn) {
        navigate(from, { replace: true });
    }
}, [isLoggedIn, navigate, from]);
 

  async function handleAuthFormSubmit(e) {
    e.preventDefault();
    try{
      const result = await dispatch(signinApiAsync({email:email, password:password}));

      if(result.type==="auth/signinApi/fulfilled"){
        console.log("result of login: ", result);
        toast.success("login successfullly.");
        clearInput();
        // navigation("/");
      }

    }catch(error){
      toast.error(error.message);
    }



  }

  function clearInput() {
  
    setEmail("");
    setPassword("");
  }

  return (
    <div className={styles.authFormContainer}>
      <form onSubmit={handleAuthFormSubmit}>
        <h2>Sign In</h2>
        <div className={styles.authFormBox}>

          <div className={styles.formControlDiv}>
            <label htmlFor="email">
              <i className="fa-regular fa-envelope"></i>
            </label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="User email..."
            />
          </div>

          <div className={styles.formControlDiv}>
            <label htmlFor="password">
              <i className="fa-solid fa-unlock-keyhole"></i>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="User password..."
            />
          </div>

          <div className={styles.formControlBtnDiv}>
          
            <button type="submit" disabled={loading}>
              {loading ? <ClipLoader size={15} color={"#fff"} /> : "Sign In"}
            </button>

          </div>
        </div>

        <div className={styles.redirectAuthDiv}>
      
          <>
           Don't have an account? <Link to={"/user/signup"}>
              <span>Sign Up</span>
           </Link>
          </>
      
      </div>



      </form>

      
    </div>
  );
}
