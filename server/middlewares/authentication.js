const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Token = require("../models/Token");
const { isTokenValid, attachCookiesToResponse } = require("../utils");

const authenticateUser = async (req, res, next) => {
  // check tokens
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    // if no token

    if (!existingToken || !existingToken?.isValid) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Please login!" });
      // throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }

    // attach cookie
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Please login!" });
    // throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  // check only specific roles to allow access
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized to access to this route!" });
      // throw new CustomError.UnauthorizedError(
      //   "Unauthorized to access to this route!"
      // );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
