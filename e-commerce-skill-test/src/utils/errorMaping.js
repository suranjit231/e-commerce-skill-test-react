// utils/errorMapping.js
export const mapFirebaseError = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "The email address is already in use by another account.";
      case "auth/invalid-email":
        return "The email address is not valid.";
      case "auth/weak-password":
        return "The password is too weak.";
      case "auth/invalid-credential":
        return "InCorrect password";
      
      default:
        return "An error occurred. Please try again.";
    }
  };
  