import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Request } from "express";

import { als } from "./als";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log("userId: ", als.getStore()?.["userId"]);
    const response = host.switchToHttp().getResponse();

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (request["__als"]) {
      als.enterWith(request["__als"]);
    }

    console.log("userId: ", als.getStore()?.["userId"]);

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
