const validationRules = {
    firstName: {
      presence: { message: "First name is required" },
      format: {
        pattern: "^[A-Za-z]+ *$",
  
        message: "First name can only contain letters",
      },
      length: { minimum: 2, maximum: 20, message: "Must be 2-20 characters" },
    },
  
    lastName: {
      presence: { message: "Last name is required" },
      format: {
        pattern: "^[A-Za-z]+ *$",
        message: "Last name can only contain letters",
      },
      length: { minimum: 2, maximum: 20, message: "Must be 2-20 characters" },
    },
  
    email: {
      presence: { message: "Email is required" },
      email: { message: "Must be a valid email address" },
    },
  
    password: {
      presence: { message: "Password is required" },
      length: { minimum: 8, message: "Must be at least 8 characters" },
      format: {
        pattern:
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        message:
          "Must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      },
    },
  };
  
  module.exports=validationRules;