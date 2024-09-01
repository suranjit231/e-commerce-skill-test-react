import styles from "./AuthForm.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { signupApiAsync} from "../../redux/authReducer";
import { errorSelector,clearError } from "../../redux/errorReducer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { loadingSelector } from "../../redux/loadingReducer";



export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setSignup] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const { errorMessage } = useSelector(errorSelector);
  const { loading } = useSelector(loadingSelector);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, dispatch]);

  useEffect(()=>{
    if(isSignup){
      navigation("/user/signin")
    }

  },[isSignup])
 

  async function handleAuthFormSubmit(e) {
    e.preventDefault();

    try{
      if(!name || !email || !password) return;
    
      const result = await dispatch(signupApiAsync({name:name, email:email, password:password}));
      
      if(result?.type==="auth/signupApi/fulfilled"){
      
          clearInput();
          toast.success("Signup successfully.");
          setSignup(true);
          
      }
      

    }catch(error){

      console.log("error signup form: ", error);
    }
  

   
  }

  function clearInput() {
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className={styles.authFormContainer}>
      <form onSubmit={handleAuthFormSubmit}>
        <h2>Sign Up</h2>
        <div className={styles.authFormBox}>
        
            <div className={styles.formControlDiv}>
              <label htmlFor="name">
                <i className="fa-regular fa-user"></i>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="User name..."
              />
            </div>
        

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
              {loading ? <ClipLoader size={15} color={"#fff"} /> : "Sign Up"}
            </button>




          </div>
        </div>

{/* ========= redirect to the signin form page ======== */}
    <div className={styles.redirectAuthDiv}>
        <>
        Already have an account?
            <Link to={"/user/signin"}>
                 <span >Sign In</span>
            </Link>
        </>
      </div>




      </form>

   


    </div>
  );
}
