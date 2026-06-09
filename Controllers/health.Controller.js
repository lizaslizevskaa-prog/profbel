
  // Importing HTTP status codes and messages from utilities
  const { Codes, Messages } = require("../Utils/httpCodesAndMessages");
  // Importing the response handler utility for managing API responses
  const ResponseHandler = require("../Utils/responseHandler");
  
  module.exports = {
      // Health check endpoint
      Health: (req, res, next) => {
          try {
              // Attempt to send a success response indicating the health status
              ResponseHandler.sendSuccess(res, "health Status", Codes.OK, Messages.OK);
              return;
          } catch (error) {
              // Handle any errors that occur during the process by sending an error response
              ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
              next(error); // Pass the error to the next middleware for further handling
          }
      }
  }
                