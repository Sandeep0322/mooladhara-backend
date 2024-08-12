import { NextFunction, Request, Response } from "express";

function asyncMiddleware(handler: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (exception) {
      console.log("async exception");
      console.log(exception);
      next(exception);
    }
  };
};

export default asyncMiddleware