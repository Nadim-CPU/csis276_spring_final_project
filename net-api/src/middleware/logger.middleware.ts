import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {

        const operation = req.body?.operationName;
        const query = req.body?.query;

        console.log(`${req.method} ${req.url}`);

        if (operation) {
            console.log(`Operation: ${operation}`);
        }

        if (query) {
            console.log(`Query: ${query}`);
        }

        res.on('finish', () => {
            console.log(`Response Status: ${res.statusCode}`);
            
        });
        next();
    }
}
