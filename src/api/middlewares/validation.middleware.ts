import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';

/**
 * Middleware validate body theo schema yup.
 * @param schema yup schema để validate dữ liệu.
 */
export const validateBody = (schema: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
      req.body = validated; // gán lại body đã được validate
      next();
    } catch (err: any) {
      return res.status(400).json({
        message: 'Invalid request data',
        errors: err.errors || ['Validation error'],
      });
    }
  };
};
