import { Request, Response, NextFunction } from 'express';
export declare const validateRequest: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateCreateProject: (import("express-validator").ValidationChain | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
export declare const validateUpdateProject: (import("express-validator").ValidationChain | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
export declare const validateProjectId: (import("express-validator").ValidationChain | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
