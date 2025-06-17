import { Request, Response, NextFunction } from 'express';
export declare const validateRequest: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateRegistration: (((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined) | import("express-validator").ValidationChain)[];
export declare const validateLogin: (((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined) | import("express-validator").ValidationChain)[];
export declare const validateGoogleLogin: (((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined) | import("express-validator").ValidationChain)[];
export declare const validateRefreshToken: (((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined) | import("express-validator").ValidationChain)[];
export declare const validatePasswordResetRequest: (((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined) | import("express-validator").ValidationChain)[];
export declare const validatePasswordReset: (((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined) | import("express-validator").ValidationChain)[];
