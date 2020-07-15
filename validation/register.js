const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {
  console.log('data: ', data);
  const errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.userName = !isEmpty(data.userName) ? data.userName : '';
  data.fname = !isEmpty(data.fname) ? data.fname : '';
  data.lname = !isEmpty(data.lname) ? data.lname : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  console.log('data2: ', data);
  console.log('data2.userName: ', data.userName);
  // Name checks
  if (Validator.isEmpty(data.userName)) {
    console.log('data.userName: ', data.userName);
    errors.userName = 'userName field is required';
  }
  if (Validator.isEmpty(data.fname)) {
    errors.fname = 'First name field is required';
  }
  if (Validator.isEmpty(data.lname)) {
    errors.lname = 'Last name field is required';
  }
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm password field is required';
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};