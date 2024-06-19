const createTokenUser = (user) => {
  return {
    username: user.username,
    userId: user._id,
    role: user.role,
    email: user.email,
  };
};

module.exports = createTokenUser;
